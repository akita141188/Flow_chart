import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
@NgModule({
  declarations: [AppComponent, DiagramComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule],
  providers: [],
})
export class AppModule {}
