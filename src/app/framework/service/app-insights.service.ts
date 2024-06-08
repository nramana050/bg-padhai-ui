import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from '../../../environments/environment';

@Injectable()
export class AppInsightsService {
  appInsights: ApplicationInsights;
  constructor() {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: environment.appInsights.instrumentationKey,
        enableAutoRouteTracking: true, // option to log all route changes
        autoTrackPageVisitTime: true
      }
    });
    this.appInsights.loadAppInsights();
    const telemetryInitializer = (envelope) => {
      envelope.tags["ai.cloud.role"] = "KW CAPTR APP:" + window.location.host;
      envelope.data.clientId = this.setClientID();
      envelope.data.suAppId = this.setsuAppId();
      envelope.data.ApplicationID = this.setApplicationID();
    }
    this.appInsights.addTelemetryInitializer(telemetryInitializer);
  }

  setsuAppId(): any {
    return localStorage.getItem('suAppId')?localStorage.getItem('suAppId'):"0";
  }
  setApplicationID(): any {
    return localStorage.getItem('ApplicationID')?localStorage.getItem('ApplicationID'):"0";
  }
  setClientID(): any {
    return  localStorage.getItem('clientId')?localStorage.getItem('clientId'):"0";
  }

  logPageView(name?: string, url?: string) { // option to call manually
    this.appInsights.trackPageView({
      name: name,
      uri: url
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    if(!properties){
      properties = {};
    }
    this.appInsights.trackEvent({ name: name }, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    if(!properties){
      properties = {};
    }
    this.appInsights.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    this.appInsights.trackException({ exception: exception, severityLevel: severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    if(!properties){
      properties = {};
    }
    this.appInsights.trackTrace({ message: message }, properties);
  }

  setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string): void {
    this.appInsights.setAuthenticatedUserContext(authenticatedUserId, "" + accountId);
  }

  clearAuthenticatedUserContext() {
    this.appInsights.clearAuthenticatedUserContext();
  }
}