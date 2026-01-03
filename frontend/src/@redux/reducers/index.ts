import { combineReducers } from '@reduxjs/toolkit';

import authentications from './authentications';
import users from './users';
import admin_assets from './admin_assets';
import assets from './assets';
import indices from './indices';
import trades from './trades';

const reducers = combineReducers({
    // PUBLIC
    authentications,
    assets,
    // PRIVATE
    users,
    indices,
    trades,
    // ADMIN
    admin_assets,
});

export default reducers;