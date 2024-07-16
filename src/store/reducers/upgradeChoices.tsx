/* eslint-disable @typescript-eslint/no-explicit-any */
export type IUpgradeChoices = Array<number>;

const initialState: IUpgradeChoices = [];

const upgradeChoicesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'wedding/set':
    case 'upgradeChoices/set':
      return action.payload.upgradeChoices;
    case 'auth/logout':
      return initialState;
    default:
      return state;
  }
};

export default upgradeChoicesReducer;
