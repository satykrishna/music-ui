import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import {MatMenuModule} from '@angular/material/menu'; 
import {MatIconModule} from '@angular/material/icon'; 
import {MatButtonModule} from  '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatListModule} from '@angular/material/list'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatTableModule} from '@angular/material/table'; 
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestHttpInterceptor } from './services/authconfig.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    HttpClientModule
  ],
  exports: [
      MatButtonModule,
      MatMenuModule,
      MatToolbarModule,
      MatIconModule,
      MatCardModule,
      MatSidenavModule,
      MatListModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatDatepickerModule,
      MatAutocompleteModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RestHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
