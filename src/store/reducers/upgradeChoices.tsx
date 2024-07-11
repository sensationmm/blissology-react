/* eslint-disable @typescript-eslint/no-explicit-any */
export type IUpgradeChoices = Array<number>;

const initialState: IUpgradeChoices = [];

const upgradeChoicesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'upgradeChoices/set':
      return action.payload;
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default upgradeChoicesReducer;
