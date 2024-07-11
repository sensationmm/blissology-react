import { FC, FunctionComponent, useEffect, useState } from 'react';

import { Grid, Tab, Tabs } from '@mui/material';

import { RootState } from 'src/store';
import { IFilters } from 'src/store/reducers/filters';
import { IMenuItem } from 'src/store/reducers/menu';

import { firstLetterUppercase } from 'src/utils/common';
import { blissologyTheme } from 'src/utils/theme';

// import DietaryInfo from '../DietaryInfo';
import EmptyCard from '../EmptyCard';
import ListCard from '../ListCard';
import TabPanel from '../TabPanel';

type IListCardContentArgs = {
  key: string;
  value: keyof IMenuItem;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IListCardContent = { id: keyof IMenuItem; Component?: FunctionComponent<any>; args?: IListCardContentArgs };

type ITabbedCards = {
  onSelect: (itemID: number | string, type: string, stateObject: RootState[keyof RootState], action: string) => void;
  tabsSetup: ITabsSetup[];
  topLevelFilter?: JSX.Element;
  secondLevelFilter?: JSX.Element;
  Filters?: IFilters;
  Content: RootState[keyof RootState];
  SelectedContent: RootState[keyof RootState];
  selectedContentKey: keyof RootState;
  filterValue2?: ITabbedCards['fliterValue2Type'];
  fliterValue2Type?: string;
  cardSpan?: number;
  cardContentKeys?: IListCardContent[];
};

export type ITabsSetup = {
  id: string;
  label: string;
};

const TabbedCards: FC<ITabbedCards> = ({
  secondLevelFilter,
  topLevelFilter,
  tabsSetup,
  onSelect,
  cardContentKeys = [{ id: 'description' }] as ITabbedCards['cardContentKeys'],
  Content,
  Filters,
  SelectedContent,
  selectedContentKey,
  filterValue2,
  cardSpan = 4
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeTab2, setActiveTab2] = useState<number>(0);

  useEffect(() => {
    setActiveTab2(0);
  }, [activeTab]);

  const renderSecondLevelTabs = (type: string) => {
    const secondLevelSetup: ITabsSetup[] = [];
    Content[type].reception?.length > 0 && secondLevelSetup.push({ id: 'reception', label: 'Reception' });
    Content[type].starter?.length > 0 && secondLevelSetup.push({ id: 'starter', label: 'Starter' });
    Content[type].main?.length > 0 && secondLevelSetup.push({ id: 'main', label: 'Main Course' });
    Content[type].sides?.length > 0 && secondLevelSetup.push({ id: 'sides', label: 'Side Dishes' });
    Content[type].dessert?.length > 0 && secondLevelSetup.push({ id: 'dessert', label: 'Dessert' });

    return renderTabs(secondLevelSetup, activeTab2 as number, setActiveTab2 as (val: number) => void, type);
  };

  const renderTabs = (setup: ITabsSetup[], active: number, setActive: (val: number) => void, topLevel?: string) => {
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
      const filteredItems = !Filters
        ? items
        : items.slice().filter((item: IMenuItem) => {
            return (Filters.diet.length === 0 || Filters.diet.every((value) => item.dietary.includes(value))) && (!item.plating || item.plating === filterValue2);
          });
      if (filteredItems.length > 0) {
        const selectedContent = firstLetterUppercase(type) ? SelectedContent : SelectedContent?.[type];
        return (
          <Grid container spacing={2} className="cards">
            {filteredItems.map((menuItem: IMenuItem, index: number) => {
              return (
                <Grid item xs={cardSpan} key={`menu-${type}-${index}`}>
                  <ListCard
                    title={menuItem.name}
                    content={(cardContentKeys || []).map((key) => {
                      const { id, Component, args } = key as IListCardContent;
                      const argsObj = args ? { [args.key]: menuItem[args.value] } : {};
                      if (Component) {
                        return <Component key={id} {...argsObj} />;
                      }
                      return menuItem[id as keyof IMenuItem] as string;
                    })}
                    image={menuItem.image}
                    selected={selectedContent?.includes(menuItem.id) || false}
                    onSelect={() => onSelect(menuItem.id, type, SelectedContent, selectedContentKey)}
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
