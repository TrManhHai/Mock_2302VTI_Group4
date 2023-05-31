import { createSelector } from "@reduxjs/toolkit";

/** Selector **/
const userLoginInfoSelector = (state) => state.userLoginInfo;

const selectTokenSelector = createSelector(
    userLoginInfoSelector,
    state => state.token);

const selectRememberMeSelector = createSelector(
    userLoginInfoSelector,
    state => state.isRememberMe);

const selectUserInfoSelector = createSelector(
    userLoginInfoSelector,
    state => state.userInfo);

const selectFullnameSelector = createSelector(
    selectUserInfoSelector,
    state => state.firstname + " " + state.lastname);

/** function */
export const selectToken = (state) => {
    return selectTokenSelector(state);
}

export const selectRememberMe = (state) => {
    return selectRememberMeSelector(state);
}

export const selectUserInfo = (state) => {
    return selectUserInfoSelector(state);
}

export const selectFullname = (state) => {
    return selectFullnameSelector(state);
}