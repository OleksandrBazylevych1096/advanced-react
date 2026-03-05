export const selectToastNotificationsCount = (state: StateSchema) =>
    state.toast.notifications.length ?? 0;
