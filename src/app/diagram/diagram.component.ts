import { AfterViewInit, Component } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css'],
})
export class DiagramComponent implements AfterViewInit {
  public diagram: go.Diagram | undefined;
  public draggedItem: string | undefined;
  public copiedNodeData: any[] = [];
  ngAfterViewInit(): void {
    this.initDiagram();
    this.initDropListeners();
    this.loadFromLocalStorage();
    this.registerKeyBindings();
  }
  loadFromLocalStorage() {}

  initDiagram() {
    const $ = go.GraphObject.make;
    this.diagram = $(go.Diagram, 'myDiagramDiv', {
      'undoManager.isEnabled': true,
      'draggingTool.isEnabled': true,
      allowDrop: true,
      'grid.visible': true,
      'grid.background': 'whitesmoke',
    });

    // Thiết lập lưới
    //Grid nét liền
    // this.diagram.grid = $(
    //   go.Panel,
    //   'Grid',
    //   {
    //     gridCellSize: new go.Size(25, 25), // Kích thước ô vuông là 100x100
    //   },
    //   $(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.1 }), // Đường ngang
    //   $(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.1 }) // Đường dọc
    // );

    // tạo grid dấu chấm
    const gridSize = 55;
    this.diagram.grid = go.GraphObject.make(
      go.Panel,
      'Grid',
      {
        gridCellSize: new go.Size(gridSize, gridSize),
      },
      // Hàng ngang
      go.GraphObject.make(go.Shape, 'LineH', {
        stroke: 'lightgray',
        strokeWidth: 0.5,
        strokeDashArray: [1, 5], // Tạo hiệu ứng đứt quãng
      }),
      // Hàng dọc
      go.GraphObject.make(go.Shape, 'LineV', {
        stroke: 'lightgray',
        strokeWidth: 0.5,
        strokeDashArray: [1, 5], // Tạo hiệu ứng đứt quãng
      })
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
          toLinkable: false,
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
      $(go.Shape, { stroke: 'white', strokeWidth: 2 }), // Đường nối
      $(go.Shape, { toArrow: 'Standard', fill: 'white' })
    );

    const modelData = JSON.parse(localStorage.getItem('diagramData') || 'null');
    if (modelData) {
      this.diagram.model = go.Model.fromJson(modelData);
    } else {
      // Nếu không có dữ liệu, khởi tạo mô hình mới
      this.diagram.model = $(go.GraphLinksModel, {
        nodeDataArray: Array.from({ length: 15 }, (v, i) => {
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
            key: i + 1,
            text: names[i % names.length] + ` ${i + 1}`,
            color: colors[i % colors.length],
            loc: `0 ${i * 50}`,
          };
        }),
        linkDataArray: [],
      });
    }
    if (this.diagram) {
      this.diagram.model.addChangedListener(() => {
        localStorage.setItem('diagramData', this.diagram!.model.toJson());
      });
    }
  }

  sortDiagram() {
    if (!this.diagram) {
      console.error('Diagram is not initialized.');
      return;
    }

    const layout = new go.TreeLayout({
      sorting: go.TreeSorting.Ascending,
      layerSpacing: 50,
      nodeSpacing: 20,
    });

    this.diagram.layout = layout;
    this.diagram.layoutDiagram(true);
  }

  // Phương thức để sao chép các nút đã chọn
  copySelectedNodes() {
    if (!this.diagram) return;

    const selectedNodes = this.diagram.selection.toArray();
    this.copiedNodeData = selectedNodes.map((node) => {
      return this.diagram?.model.findNodeDataForKey(node.data.key) || {};
    });
  }

  pasteCopiedNodes() {
    if (!this.diagram || this.copiedNodeData.length === 0) return;

    const newNodeDataArray = this.copiedNodeData.map((nodeData) => {
      return {
        ...nodeData,
        key: Number(this.diagram?.model.nodeDataArray.length) + 1,
      };
    });

    this.diagram.model.addNodeDataCollection(newNodeDataArray);
  }

  registerKeyBindings() {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'c') {
        this.copySelectedNodes();
        event.preventDefault();
      } else if (event.ctrlKey && event.key === 'v') {
        this.pasteCopiedNodes();
        event.preventDefault();
      }
    });
  }

  initDropListeners() {
    const diagramDiv = document.getElementById('myDiagramDiv');
    if (diagramDiv) {
      diagramDiv.addEventListener('dragover', (event) =>
        event.preventDefault()
      );

      diagramDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        if (!this.diagram || !this.draggedItem) return;

        const point = this.diagram.transformDocToView(
          new go.Point(event.clientX, event.clientY)
        );

        // Tạo node mới với tọa độ xác định
        this.diagram.model.addNodeData({
          key: this.diagram.model.nodeDataArray.length + 1,
          text: this.draggedItem,
          loc: `${point.x} ${point.y}`, // Sử dụng tọa độ trong mô hình
          color: 'lightblue',
          figure: 'RoundedRectangle',
        });
      });
    }
  }

  onItemDragStart(item: string) {
    this.draggedItem = item;
  }
}
