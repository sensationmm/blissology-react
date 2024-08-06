import { FC, useEffect, useState } from 'react';

import { Grid, Tab, Tabs } from '@mui/material';

import { RootState } from 'src/store';
import { IDrinksItem } from 'src/store/reducers/drinks';
import { IFilters } from 'src/store/reducers/filters';
import { IMenuItem } from 'src/store/reducers/menu';
import { IOrders } from 'src/store/reducers/orders';
import { IUpgradeParams } from 'src/store/reducers/upgrades';

import EmptyCard from 'src/components/EmptyCard';
import ListCard, { IListCardContent } from 'src/components/ListCard';
import TabPanel from 'src/components/TabPanel';

import { capitalize, firstLetterUppercase } from 'src/utils/common';
import { blissologyTheme } from 'src/utils/theme';

export type ITabsSetup = {
  id: string;
  description?: string;
  label: string;
};

export type ITabs2Setup = {
  [key: string]: ITabsSetup[];
};

interface ITabbedCard extends IMenuItem, IUpgradeParams, IDrinksItem {}

type IFilter = 'diet' | 'drinkType' | 'plating' | 'wineType';

type ITabbedCards = {
  onSelect: (itemID: number | string, type: string, stateObject: RootState[keyof RootState], action: string, set: 'push' | 'replace', orderNum?: number) => void;
  tabsSetup: ITabsSetup[];
  tabs2Setup?: ITabs2Setup;
  topLevelFilter?: JSX.Element;
  secondLevelFilter?: JSX.Element;
  Filters?: IFilters;
  Content: RootState[keyof RootState];
  SelectedContent: RootState[keyof RootState];
  selectedContentKey: keyof RootState;
  SelectedOrders?: IOrders;
  cardSpan?: number;
  cardContentKeys?: IListCardContent[];
  cardIconKeys?: IListCardContent[];
  activeFilters?: IFilter[];
};

const TabbedCards: FC<ITabbedCards> = ({
  secondLevelFilter,
  topLevelFilter,
  tabsSetup,
  tabs2Setup,
  onSelect,
  cardContentKeys = [{ id: 'description' }] as ITabbedCards['cardContentKeys'],
  cardIconKeys = [],
  Content,
  Filters,
  SelectedContent,
  selectedContentKey,
  SelectedOrders,
  cardSpan = 4,
  activeFilters = []
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeTab2, setActiveTab2] = useState<number>(0);

  useEffect(() => {
    setActiveTab2(0);
  }, [activeTab]);

  const renderSecondLevelTabs = (type: string) => {
    if (!tabs2Setup) return;
    return renderTabs(tabs2Setup[type], activeTab2 as number, setActiveTab2 as (val: number) => void, type);
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
            {setup?.map((m, count) => <Tab key={`tab-button-${count}`} label={m.label} />)}
          </Tabs>

          {isTopLevel ? topLevelFilter : secondLevelFilter}
        </div>
        <Grid container spacing={2} className="cards">
          <div>
            {setup?.map((m, count) => (
              <TabPanel key={`tab-content-${count}`} value={active as number} index={count}>
                {list[m.id]?.length !== undefined || tabs2Setup === undefined ? (
                  renderTabItems(list[m.id], m.id, m.description ? { text: m.description, title: capitalize(m.id) } : undefined)
                ) : (
                  <>
                    {m.description && <ListCard title={capitalize(m.id)} content={m.description} isTitleCard sx={{ mb: '20px' }} />}
                    {renderSecondLevelTabs(m.id)}
                  </>
                )}
              </TabPanel>
            ))}
          </div>
        </Grid>
      </>
    );
  };

  const renderTabItems = (items: ITabbedCard[], type: string, titleCard?: { title: string; text?: string }) => {
    if (items.length > 0) {
      const filteredItems = !Filters
        ? items
        : items.slice().filter((item: ITabbedCard) => {
            return (
              (!activeFilters.includes('diet') || Filters.diet.length === 0 || Filters.diet.every((value) => item.dietary.includes(value))) &&
              (!activeFilters.includes('plating') || !item.plating || item.plating === Filters.plating) &&
              (!activeFilters.includes('drinkType') || !item.drinkType || item.drinkType === Filters.drinkType || Filters.drinkType === 'all') &&
              (!activeFilters.includes('wineType') || !item.wineType || item.wineType === Filters.wineType || Filters.wineType === 'all')
            );
          });
      if (filteredItems.length > 0) {
        const selectedContent = firstLetterUppercase(type) ? SelectedContent : SelectedContent?.[type];
        return (
          <Grid container spacing={2} className="cards">
            {titleCard && (
              <Grid item xs={12}>
                <ListCard title={titleCard.title} content={titleCard.text} isTitleCard />
              </Grid>
            )}
            {filteredItems.map((menuItem: ITabbedCard, index: number) => {
              const hasMinimum = menuItem.minimumOrder?.hasMinimum !== 'none';

              return (
                <Grid item xs={cardSpan} key={`menu-${type}-${index}`} sx={{ display: 'flex' }}>
                  <ListCard
                    title={menuItem.name}
                    content={cardContentKeys || []}
                    icons={cardIconKeys}
                    image={menuItem.image}
                    item={menuItem}
                    selected={selectedContent?.includes(menuItem.id) || false}
                    onSelect={(orderNum?: number) => onSelect(menuItem.id, type, SelectedContent, selectedContentKey, 'push', orderNum)}
                    sx={{ minHeight: `${cardSpan * 2 * 20}px` }}
                    order={
                      menuItem.postType === 'upgrade' && (!!menuItem.minimumOrder || !!menuItem.priceFor)
                        ? {
                            min: ['people','items'].includes(menuItem.minimumOrder?.hasMinimum) ? menuItem.minimumOrder.num : menuItem.minimumOrder.percentage,
                            required: menuItem.postType === 'upgrade' || menuItem.minimumOrder.hasMinimum !== 'none',
                            type: hasMinimum ? menuItem.minimumOrder?.hasMinimum : menuItem.priceFor?.unit
                          }
                        : undefined
                    }
                    ordered={SelectedOrders && Object.keys(SelectedOrders).includes(menuItem.id.toString()) ? SelectedOrders[menuItem.id] : undefined}
                    options={menuItem.hasOptions || menuItem.hasOptionsPrices ? menuItem.options : undefined}
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
