export interface IUserSettings {
  showEmail: boolean
  showBio: boolean
  showLocation: boolean
  showDateOfBirth: boolean
  reduceAnimation: boolean
  enablePushNotifications?: boolean
  enableEmailNotifications?: boolean
  notifyOnNewPostPush?: boolean
  notifyOnNewPostEmail?: boolean
  notifyOnNewCommentPush?: boolean
  notifyOnNewCommentEmail?: boolean
  notifyOnLikePush?: boolean
  notifyOnLikeEmail?: boolean
  notifyOnRepostPush?: boolean
  notifyOnRepostEmail?: boolean
  theme?: 'purple' | 'monochrome' | 'brown' | 'green'
  notifyOnNewFollowerPush?: boolean
  notifyOnNewFollowerEmail?: boolean
  notifyOnCommentLikePush?: boolean
  notifyOnCommentLikeEmail?: boolean
}
