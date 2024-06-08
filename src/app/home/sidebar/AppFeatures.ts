export interface IAppFeatures {
  featureId: number;
  name?: string;
  state?: string;
  icon?: string;
  subFeatures?: IAppFeatures[];
}
