export const applyAuthorizationHeader = (accessToken: string) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
