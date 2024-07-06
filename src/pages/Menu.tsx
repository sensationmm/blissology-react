import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';

import { Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Grid';

import store, { RootState } from 'src/store';
import { IMenuItem, initialState as emptyMenuState } from 'src/store/reducers/menu';

import { wpRestApiHandler } from 'src/api/wordpress';

import DietaryInfo from 'src/components/DietaryInfo';
import Layout from 'src/components/Layout/Layout';
import ListCard from 'src/components/ListCard';
import TabPanel from 'src/components/TabPanel';

import { formatMenuItems } from 'src/utils/wordpress/menu';

type IMenuSetup = {
  id: string;
  label: string;
};

const Menu = () => {
  const authState = (state: RootState['auth']) => state.auth;
  const menuState = (state: RootState['menu']) => state.menu;
  const diningState = (state: RootState['menu']) => state.dining;
  const uiState = (state: RootState['ui']) => state.ui;
  const { isLoading } = useSelector(uiState);
  const { token } = useSelector(authState);
  const Menu = useSelector(menuState);
  const Dining = useSelector(diningState);
  const [resetDining, setResetDining] = useState<RootState['dining']>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeTab2, setActiveTab2] = useState<number>(0);

  useEffect(() => {
    store.dispatch({
      payload: { isLoading: true },
      type: 'ui/setLoading'
    });
    if (Menu === emptyMenuState && !!token) {
      wpRestApiHandler(`menu?_embed=wp:term&_fields=id,title,_links,_embedded,acf&acf_format=standard&per_page=100&orderby=title&order=asc`, undefined, 'GET', token).then(
        async (resp) => {
          const respJson = await resp.json();

          const dispatchPayload = formatMenuItems(respJson);

          await store.dispatch({
            payload: dispatchPayload,
            type: 'menu/set'
          });
          store.dispatch({
            payload: { isLoading: false },
            type: 'ui/setLoading'
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    !resetDining && setResetDining(cloneDeep(Dining));
  }, [Dining]);

  useEffect(() => {
    setActiveTab2(0);
  }, [activeTab]);

  const onSelect = (itemID: number, type: string) => {
    const currentChoices = Dining[type].slice();
    if (currentChoices.includes(itemID)) {
      currentChoices.splice(currentChoices.indexOf(itemID), 1);
    } else {
      currentChoices.push(itemID);
    }

    store.dispatch({
      payload: { choices: currentChoices, type: type },
      type: 'dining/update'
    });
  };

  const onSaveChoices = () => {};

  const onResetChoices = () => {
    store.dispatch({
      payload: resetDining,
      type: 'dining/set'
    });
  };

  const renderSecondLevelMenu = (type: string) => {
    const secondLevelSetup: IMenuSetup[] = [];
    Menu[type].reception?.length > 0 && secondLevelSetup.push({ id: 'reception', label: 'Reception' });
    Menu[type].starter.length > 0 && secondLevelSetup.push({ id: 'starter', label: 'Starter' });
    Menu[type].main.length > 0 && secondLevelSetup.push({ id: 'main', label: 'Main Course' });
    Menu[type].dessert.length > 0 && secondLevelSetup.push({ id: 'dessert', label: 'Dessert' });

    return renderMenu(secondLevelSetup, activeTab2, setActiveTab2, type);
  };

  const renderMenu = (setup: IMenuSetup[], active: number, setActive: (num: number) => void, topLevel?: string) => {
    const list = topLevel !== undefined ? Menu[topLevel] : Menu;
    return (
      <>
        <Tabs value={active} onChange={(_, setTab) => setActive(setTab)} className={topLevel ? 'secondLevel' : ''}>
          {setup.map((m, count) => (
            <Tab key={`tab-button-${count}`} label={m.label} />
          ))}
        </Tabs>
        <Grid container spacing={2} className="cards">
          <div>
            {setup.map((m, count) => (
              <TabPanel key={`tab-content-${count}`} value={active} index={count}>
                {list[m.id]?.length !== undefined ? renderMenuItems(list[m.id], m.id) : renderSecondLevelMenu(m.id)}
              </TabPanel>
            ))}
          </div>
        </Grid>
      </>
    );
  };

  const renderMenuItems = (items: IMenuItem[], type: string) => {
    if (items.length > 0) {
      return (
        <Grid container spacing={2} className="cards">
          {items.map((menuItem: IMenuItem, index: number) => {
            return (
              <Grid item xs={4} key={`menu-${type}-${index}`}>
                <ListCard
                  title={menuItem.name}
                  content={[menuItem.description, <DietaryInfo key={'content-diets'} diets={menuItem?.dietary} />]}
                  image={menuItem.image}
                  selected={Dining[type].includes(menuItem.id)}
                  onSelect={() => onSelect(menuItem.id, type)}
                  sx={{ minHeight: '100px' }}
                />
              </Grid>
            );
          })}
        </Grid>
      );
    }
  };

  const isEdited = JSON.stringify(Dining) !== JSON.stringify(resetDining);

  const menuSetup: IMenuSetup[] = [];
  Menu.reception.length > 0 && menuSetup.push({ id: 'reception', label: 'Reception Options' });
  Object.values(Menu.dinner).flat().length > 0 && menuSetup.push({ id: 'dinner', label: 'Dinner Options' });
  Menu.evening.length > 0 && menuSetup.push({ id: 'evening', label: 'Evening Options' });
  Object.values(Menu.kids).flat().length > 0 && menuSetup.push({ id: 'kids', label: 'Kids Options' });

  return (
    <Layout
      title="Menu"
      actions={[
        { color: 'secondary', disabled: !isEdited, label: 'Reset', onClick: onResetChoices },
        { disabled: !isEdited, label: 'Save', onClick: onSaveChoices }
      ]}>
      {!isLoading ? renderMenu(menuSetup, activeTab, setActiveTab) : <></>}
    </Layout>
  );
};

export default Menu;
