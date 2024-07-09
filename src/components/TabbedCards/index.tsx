import { FC } from 'react';

import { Grid, Tab, Tabs } from '@mui/material';

import { RootState } from 'src/store';
import { IFilters } from 'src/store/reducers/filters';
import { IMenuItem } from 'src/store/reducers/menu';

import { blissologyTheme } from 'src/utils/theme';

import DietaryInfo from '../DietaryInfo';
import EmptyCard from '../EmptyCard';
import ListCard from '../ListCard';
import TabPanel from '../TabPanel';

type ITabbedCards = {
  onSelect: (itemID: number | string, type: string, stateObject: RootState[keyof RootState], action: string) => void;
  tabsSetup: ITabsSetup[];
  activeTab: number;
  setActiveTab: (tabNum: number) => void;
  activeTab2?: number;
  setActiveTab2?: (tabNum: number) => void;
  topLevelFilter?: JSX.Element;
  secondLevelFilter?: JSX.Element;
  Filters: IFilters;
  Content: RootState[keyof RootState];
  SelectedContent: RootState[keyof RootState];
  filterValue2: ITabbedCards['fliterValue2Type'];
  fliterValue2Type: string;
};

export type ITabsSetup = {
  id: string;
  label: string;
};

const TabbedCards: FC<ITabbedCards> = ({
  secondLevelFilter,
  topLevelFilter,
  activeTab,
  activeTab2,
  setActiveTab2,
  tabsSetup,
  setActiveTab,
  onSelect,
  Filters,
  Content,
  SelectedContent,
  filterValue2
}) => {
  const renderSecondLevelTabs = (type: string) => {
    const secondLevelSetup: ITabsSetup[] = [];
    Content[type].reception?.length > 0 && secondLevelSetup.push({ id: 'reception', label: 'Reception' });
    Content[type].starter?.length > 0 && secondLevelSetup.push({ id: 'starter', label: 'Starter' });
    Content[type].main?.length > 0 && secondLevelSetup.push({ id: 'main', label: 'Main Course' });
    Content[type].sides?.length > 0 && secondLevelSetup.push({ id: 'sides', label: 'Side Dishes' });
    Content[type].dessert?.length > 0 && secondLevelSetup.push({ id: 'dessert', label: 'Dessert' });

    return renderTabs(secondLevelSetup, activeTab2 as ITabbedCards['activeTab2'], setActiveTab2 as ITabbedCards['setActiveTab2'], type);
  };

  const renderTabs = (setup: ITabsSetup[], active: ITabbedCards['activeTab2'], setActive: ITabbedCards['setActiveTab2'], topLevel?: string) => {
    const isTopLevel = topLevel === undefined;
    const list = !isTopLevel ? Content[topLevel] : Content;
    return (
      <>
        <div
          style={{
            alignItems: 'center',
            background: isTopLevel ? blissologyTheme.palette.tertiary.main : blissologyTheme.palette.tertiary.light,
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: isTopLevel ? '5px' : ''
          }}>
          <Tabs value={active} onChange={(_, setTab) => setActive?.(setTab)} className={topLevel ? 'secondLevel' : ''}>
            {setup.map((m, count) => (
              <Tab key={`tab-button-${count}`} label={m.label} />
            ))}
          </Tabs>

          {isTopLevel ? topLevelFilter : secondLevelFilter}
        </div>
        <Grid container spacing={2} className="cards">
          <div>
            {setup.map((m, count) => (
              <TabPanel key={`tab-content-${count}`} value={active as number} index={count}>
                {list[m.id]?.length !== undefined ? renderTabItems(list[m.id], m.id) : renderSecondLevelTabs(m.id)}
              </TabPanel>
            ))}
          </div>
        </Grid>
      </>
    );
  };

  const renderTabItems = (items: IMenuItem[], type: string) => {
    if (items.length > 0) {
      const filteredItems = items.slice().filter((item: IMenuItem) => {
        return (Filters.diet.length === 0 || Filters.diet.every((value) => item.dietary.includes(value))) && (!item.plating || item.plating === filterValue2);
      });
      if (filteredItems.length > 0) {
        return (
          <Grid container spacing={2} className="cards">
            {filteredItems.map((menuItem: IMenuItem, index: number) => {
              return (
                <Grid item xs={4} key={`menu-${type}-${index}`}>
                  <ListCard
                    title={menuItem.name}
                    content={[menuItem.description, <DietaryInfo key={'content-diets'} diets={menuItem?.dietary} />]}
                    image={menuItem.image}
                    selected={SelectedContent[type].includes(menuItem.id)}
                    onSelect={() => onSelect(menuItem.id, type, SelectedContent, 'dining')}
                    sx={{ minHeight: '100px' }}
                  />
                </Grid>
              );
            })}
          </Grid>
        );
      } else {
        return <EmptyCard />;
      }
    }
  };

  return renderTabs(tabsSetup, activeTab, setActiveTab);
};

export default TabbedCards;
