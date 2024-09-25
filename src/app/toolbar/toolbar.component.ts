import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  @Output() dragStart = new EventEmitter<string>();

  onDragStart(e: DragEvent, item: string) {
    this.dragStart.emit(item);
  }
}
