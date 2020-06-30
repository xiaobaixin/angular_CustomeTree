import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomeTreeComponent } from '../customeTree/customeTree.component';

@NgModule({
   declarations: [
      AppComponent,
      CustomeTreeComponent
   ],
   imports: [
      BrowserModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
