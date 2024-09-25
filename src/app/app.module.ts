import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
@NgModule({
  declarations: [AppComponent, DiagramComponent, ToolbarComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule],
  providers: [],
})
export class AppModule {}
