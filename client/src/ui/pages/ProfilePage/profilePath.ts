const profilePath = '/profile';

export default profilePath;

export const routerPath = '/profile/:userId?';

export const getLinkForUserId = (userId: string) => `${profilePath}/${userId}/`;
