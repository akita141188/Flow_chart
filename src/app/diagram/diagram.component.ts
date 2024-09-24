import { AfterViewInit, Component } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css'],
})
export class DiagramComponent implements AfterViewInit {
  public diagram: go.Diagram | undefined;
  public copiedNodeData: any[] = [];
  ngAfterViewInit(): void {
    this.initDiagram();
    // this.registerKeyBindings();
  }

  initDiagram() {
    const $ = go.GraphObject.make;
    this.diagram = $(go.Diagram, 'myDiagramDiv', {
      'grid.visible': true, // Hiển thị lưới
      'grid.gridCellSize': new go.Size(20, 20), // Kích thước ô lưới
      'grid.background': 'whitesmoke', // Màu nền của lưới
      draggingTool: new go.DraggingTool(), // Cho phép kéo và thả
      allowSelect: true, // Cho phép lựa chọn
    });

    // Thiết lập lưới
    this.diagram.grid = $(
      go.Panel,
      'Grid',
      $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.5 }), // Đường ngang
      $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.5 }) // Đường dọc
    );

    // Thiết lập nodeTemplate với 2 chấm kết nối
    this.diagram.nodeTemplate = $(
      go.Node,
      'Spot',
      {
        locationSpot: go.Spot.Center,
      },
      // Định nghĩa hình dạng chính của node
      $(
        go.Shape,
        'RoundedRectangle',
        {
          name: 'SHAPE',
          fill: $(go.Brush, 'Linear'), // Khởi tạo Brush loại Linear
          stroke: 'darkblue',
          strokeWidth: 1,
          width: 120,
          height: 40,
        },
        new go.Binding('figure', 'fig'),
        new go.Binding('fill', 'color'),
        {
          portId: '',
          toLinkable: true,
        },
        new go.Binding('fill', 'color', function (color, obj) {
          const brush = new go.Brush('Linear');
          brush.addColorStop(0, 'yellow'); // Màu đầu tiên
          brush.addColorStop(1, 'green'); // Màu thứ hai
          return brush;
        })
      ),
      $(
        go.Panel,
        'Vertical',
        { alignment: go.Spot.Left, alignmentFocus: go.Spot.Left },
        $(go.Shape, 'Circle', {
          portId: 'Blue',
          fill: 'blue',
          width: 10,
          height: 10,
          toLinkable: true,
          fromLinkable: true,
        })
      ),
      $(
        go.Panel,
        'Vertical',
        {
          alignment: go.Spot.Right,
          alignmentFocus: go.Spot.Right,
        },
        $(go.Shape, 'Circle', {
          portId: 'Green',
          fill: 'green',
          width: 10,
          height: 10,
          toLinkable: true,
          fromLinkable: true,
        }),
        $(go.Panel, 'Vertical', { height: 5 }),
        $(go.Shape, 'Circle', {
          portId: 'Red',
          fill: 'red',
          width: 10,
          height: 10,
          toLinkable: true,
          fromLinkable: true,
        })
      ),
      $(
        go.TextBlock,
        {
          margin: 5,
          font: ' 14px sans-serif', // Thay đổi kiểu chữ
          stroke: 'white', // Màu chữ
        },
        new go.Binding('text', 'text')
      )
    );

    this.diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Routing.AvoidsNodes,
        curve: go.Curve.JumpOver,
        corner: 5,
        relinkableFrom: true,
        relinkableTo: true,
        fromSpot: go.Spot.Right,
        toSpot: go.Spot.Left,
        layerName: 'Foreground', // Đặt lên trên cùng để tránh bị chồng
      },
      $(go.Shape, { stroke: 'black' }), // Đường nối
      $(go.Shape, { toArrow: 'Standard', fill: 'black' }) // Mũi tên
    );

    this.diagram.model = $(go.GraphLinksModel, {
      nodeDataArray: Array.from({ length: 1000 }, (v, i) => {
        const colors = [
          'lightblue',
          'lightgreen',
          'lightcoral',
          'lightgoldenrodyellow',
          'lightpink',
        ];
        const names = [
          'Start',
          'Beta',
          'Gamma',
          'Delta',
          'Epsilon',
          'Zeta',
          'Eta',
          'Theta',
          'Iota',
          'Kappa',
          'Lambda',
          'Mu',
          'Nu',
          'Xi',
          'Omicron',
          'Pi',
          'Rho',
          'Sigma',
          'Tau',
          'Upsilon',
          'Phi',
          'Chi',
          'Psi',
          'Omega',
        ];

        return {
          key: i + 1, // Tạo key từ 1 đến 1000
          text: names[i % names.length] + ` ${i + 1}`, // Tạo text dựa trên tên và chỉ số
          color: colors[i % colors.length], // Chọn màu ngẫu nhiên từ mảng màu
        };
      }),
      linkDataArray: [],
    });
  }

  sortDiagram() {
    if (!this.diagram) {
      console.error('Diagram is not initialized.');
      return;
    }

    const layout = new go.TreeLayout({
      sorting: go.TreeSorting.Ascending,
      layerSpacing: 50, // Khoảng cách giữa các lớp
      nodeSpacing: 20,
    });

    this.diagram.layout = layout;
    this.diagram.layoutDiagram(true);
  }

  // Phương thức để sao chép các nút đã chọn
  // copySelectedNodes() {
  //   if (!this.diagram) return;

  //   const selectedNodes = this.diagram.selection.toArray();
  //   this.copiedNodeData = selectedNodes.map((node) => {
  //     return this.diagram?.model.findNodeDataForKey(node.data.key) || {};
  //   });
  // }

  // pasteCopiedNodes() {
  //   if (!this.diagram || this.copiedNodeData.length === 0) return;

  //   const newNodeDataArray = this.copiedNodeData.map((nodeData) => ({
  //     ...nodeData,
  //     key: this.diagram.model.nodeDataArray.length + 1,
  //   }));

  //   this.diagram.model.addNodeDataCollection(newNodeDataArray);
  // }

  // registerKeyBindings() {
  //   document.addEventListener('keydown', (event) => {
  //     if (event.ctrlKey && event.key === 'c') {
  //       this.copySelectedNodes();
  //       event.preventDefault();
  //     } else if (event.ctrlKey && event.key === 'v') {
  //       this.pasteCopiedNodes();
  //       event.preventDefault();
  //     }
  //   });
  // }
}
