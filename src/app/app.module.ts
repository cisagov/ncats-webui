import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { PrettyJsonModule } from "angular2-prettyjson";
import { MomentModule } from "angular2-moment";
import { DragulaModule } from "ng2-dragula";
import { DragulaService } from "ng2-dragula/ng2-dragula";

import { AppRouting } from "./routing/app.routing";
import { AppComponent } from "./app.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { StatusComponent } from "./status/status.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HiringDashboardComponent } from "./hiringdashboard/hiringdashboard.component";
import { HostMapComponent } from "./host-map/host-map.component";

import { CookieService } from "./cookie.service";
import { CyhyDataService } from "./cyhy-data.service";
import { CyhyTitleService } from "./cyhy-title.service";
import { CyhyConfigService } from "./cyhy-config.service";
import { ModalManagerService } from "./modal-manager.service";
import { PageCycleService } from "./page-cycle.service";
import { QueryParamExaminerService } from "./query-param-examiner.service";
import { HistoryComponent } from "./history/history.component";
import { ScanMapComponent } from "./scan-map/scan-map.component";
import { VulnerabilityMapComponent } from "./vulnerability-map/vulnerability-map.component";
import { FirstSeenVulnsComponent } from "./first-seen-vulns/first-seen-vulns.component";
import { PreferencesComponent } from "./preferences/preferences.component";
import { CybexComponent } from "./cybex/cybex.component";
import { BodComponent } from "./bod/bod.component";
import { WeeklyTicketsComponent } from "./weekly-tickets/weekly-tickets.component";
import { MetricsComponent } from "./metrics/metrics.component";
import { LoadingCirclesComponent } from "./loading-circles/loading-circles.component";
import { MetricsResultsComponent } from "./metrics-results/metrics-results.component";
import { StatusDetailComponent } from "./status-detail/status-detail.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { RiskRatingComponent } from "./risk-rating/risk-rating.component";
import { FemaComponent } from "./fema/fema.component";
import { CongressionalComponent } from "./congressional/congressional.component";
import { StakeholdersComponent } from "./stakeholders/stakeholders.component";

//Note: this factory needs to return a function (that returns a promise)
export function CyhyConfigLoader(cyhyConfigService: CyhyConfigService) {
  return () => cyhyConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    StatusComponent,
    DashboardComponent,
    HiringDashboardComponent,
    HostMapComponent,
    HistoryComponent,
    ScanMapComponent,
    VulnerabilityMapComponent,
    FirstSeenVulnsComponent,
    PreferencesComponent,
    CybexComponent,
    BodComponent,
    WeeklyTicketsComponent,
    MetricsComponent,
    LoadingCirclesComponent,
    MetricsResultsComponent,
    StatusDetailComponent,
    NavbarComponent,
    RiskRatingComponent,
    FemaComponent,
    CongressionalComponent,
    StakeholdersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting,
    ReactiveFormsModule,
    PrettyJsonModule,
    MomentModule,
    DragulaModule,
  ],
  providers: [
    CookieService,
    CyhyDataService,
    CyhyTitleService,
    CyhyConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: CyhyConfigLoader,
      deps: [CyhyConfigService],
      multi: true,
    },
    DragulaService,
    ModalManagerService,
    PageCycleService,
    QueryParamExaminerService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
