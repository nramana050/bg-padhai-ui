import * as moment from 'moment';
import { ApplicationConstant } from '../constants/app-constant';
import * as jsonDataDev from 'src/assets/label.json';
import * as jsonDataTest from 'src/assets/labelTest.json';
import * as jsonDataProd from 'src/assets/labelProd.json'
import { environment } from 'src/environments/environment';

export class Utility {

    static DEFAULT_PROFILE_URL = 'captr-learner';

    static filterArrayByKeyAndValue(items: any[], key: any, value: any): any[] {
        return items.filter(function (item) {
            return item[key] === value;
        });
    }

    static filterArrayByKeyAndArray(items: any[], key: any, value: any[]): any[] {
        return items.filter(function (item) {
            return value.includes(item[key]);
        });
    }

    static getObjectFromArrayByKeyAndValue(items: any[], key: any, value: any): any {
        const list = items.filter(function (item) {
            return item[key] === value;
        });
        if (list.length === 1) {
            return list[0];
        }
        if (list.length <= 0) {
            return null;
        }
        if (list.length > 1) {
            throw new Error('The specified array has multiple objects with key: ' + key + ' and value: ' + value);
        }
        return null;
    }

    static isEmpty(value: string): boolean {
        if (value === undefined || value === null || value === '') {
            return true;
        }
        return false;
    }
    static transformDateToString(date) {
        if (date && moment.isMoment(date)) {
            return date.format(ApplicationConstant.DEFAULT_DATE_FORMAT);
        } else if (date && !moment.isMoment(date)) {
            return this.transformStringToMomentDate(date).format(ApplicationConstant.DEFAULT_DATE_FORMAT);
        } else {
            return date;
        }
    }
    static transformStringToDate(date: string) {
        moment.locale('en-gb');
        return moment(date, ApplicationConstant.DEFAULT_DATE_FORMAT).toDate();
    }

    static transformStringToMomentDate(date: string) {
        moment.locale('en-gb');
        return moment(date, ApplicationConstant.DEFAULT_DATE_FORMAT);
    }

    static isUserActive(userList, userId) {
        const user = Utility.getObjectFromArrayByKeyAndValue(userList, 'id', userId);
        if (user === null) {
            return false;
        }
        return true;
    }
    setProperty(array: any[], field: string, value) {
        array.forEach((obj: any) => {
            obj[field] = value;
        });
    }

    static getUniqueObjectsByProperties(arr, keyProps) {
        return Object.values(arr.reduce((uniqueMap, entry) => {
            const key = keyProps.map(k => entry[k]).join('|');
            if (!(key in uniqueMap)) {
                uniqueMap[key] = entry;
            }
            return uniqueMap;
        }, {}));     
    } 

    static dateToString(date) {
        if (date) {
          return new Date(date).getFullYear() + '-' + ('0' + (new Date(date).getMonth() + 1)).slice(-2) +
          '-' + ('0' + new Date(date).getDate()).slice(-2);
        } else {
          return date;
        }
      }

    static getPageTitleByClientIdAndFeatureId(identifier) {
        const clientId = +localStorage.getItem('clientId');

        let localJson = Utility.getJsonData();

        for (let i = 0; i < localJson.length; i++) {
            if (localJson[i].clientId === clientId) {
                const featureDetail = localJson[i].featureDetail
                for (let j = 0; j < featureDetail?.length; j++) {
                    if (featureDetail[j].identifier === identifier) {
                        return featureDetail[j];
                    }
                }

            }
        }
    }
    
      static filterMapByKey( key: any): any[] {
        const storedData = localStorage.getItem('refData');
        let refData   = JSON.parse(decodeURIComponent(storedData));
        if (refData && refData.refDataMap && refData.refDataMap[key]) {
            return refData.refDataMap[key];
          } else {
            return undefined; // Key not found
          }  
     }


     static filterPlanMapByKey( key: any,planKey:string): any[] {
        const storedData = localStorage.getItem(planKey);
        let refData   = JSON.parse(decodeURIComponent(storedData));
        if (refData && refData.refDataMap && refData.refDataMap[key]) {
            return refData.refDataMap[key];
          } else {
            return undefined; // Key not found
          }  
     }
    private static getJsonData() {
        let localJson = null;


        switch (environment.env) {
            case ApplicationConstant.DEV_ENV:
                localJson = jsonDataDev;
                break;

            case ApplicationConstant.TEST_ENV:
                localJson = jsonDataTest;
                break;

            case ApplicationConstant.PROD_ENV:
                localJson = jsonDataProd;
                break;

            default:
                localJson = jsonDataDev;
                break;

        }
        return localJson;
    }

    static getProfileUrl(identifier) {

        let url = this.DEFAULT_PROFILE_URL;
        
        const clientId = +localStorage.getItem('clientId');

        let localJson = Utility.getJsonData();

        for (let i = 0; i < localJson.length; i++) {
            if (localJson[i].clientId === clientId) {
                const profileRouteDetails = localJson[i].profileRouteDetails;

                for (let j = 0; j < profileRouteDetails?.length; j++) {
                    if (profileRouteDetails[j].identifier === identifier) {
                        url = profileRouteDetails[j].profileRoute
                    }
                }

            } 
        }

        return url;

    }


    static getPathByIdentifier(identifier) {
        if (identifier == "person-supported") {
            return "/plan-v2"
        }
        else {
            return "/risk-assessment"
        }
    }
}
