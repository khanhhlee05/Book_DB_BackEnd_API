export const isMemberActive = (user) => {
    const now = new Date();
    if (user.membership && user.membership.length > 0) {
        const latestMembership = user.membership[user.membership.length - 1];
        const latestStartDate = new Date(latestMembership.startDate);
        const latestEndDate = new Date(latestMembership.endDate);
        return now >= latestStartDate && now < latestEndDate;
    }
    return false;
};
