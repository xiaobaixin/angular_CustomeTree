import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customeTree',
  templateUrl: './customeTree.component.html',
  styleUrls: ['./customeTree.component.css']
})
export class CustomeTreeComponent implements OnInit {
  testData: Array<any> = [{name: '根节点1', id: 1, parentId: 0, expand: false, depth: 0, isLastLeaf: false, selectStatus: 0},
                          {name: '根节2', id: 2, parentId: 0, expand: false, depth: 0, isLastLeaf: false, selectStatus: 0},
                          {name: '根节点3', id: 3, parentId: 0, expand: false, depth: 0, isLastLeaf: false, selectStatus: 0},
                          {name: '根节点4', id: 4, parentId: 0, expand: false, depth: 0, isLastLeaf: false, selectStatus: 0},
                          {name: '子节点1-1', id: 101, parentId: 1, expand: false, depth: 1, isLastLeaf: false, selectStatus: 0},
                          {name: '子节点1-2', id: 102, parentId: 1, expand: false, depth: 1, isLastLeaf: false, selectStatus: 0},
                          {name: '子节点1-1-1', id: 10101, parentId: 101, expand: false, depth: 2, isLastLeaf: true, selectStatus: 0},
                          {name: '子节点1-1-2', id: 10102, parentId: 102, expand: false, depth: 2, isLastLeaf: true, selectStatus: 0},
                          {name: '子节点1-1-3', id: 10103, parentId: 102, expand: false, depth: 2, isLastLeaf: true, selectStatus: 0},
                          {name: '子节点2-1', id: 201, parentId: 2, expand: false, depth: 1, isLastLeaf: true, selectStatus: 0},
                          {name: '子节点3-1', id: 301, parentId: 3, expand: false, depth: 1, isLastLeaf: true, selectStatus: 0}];
  expandData: Array<any> = []; // 真正展示的数据
  mark: Array<any> = []; // 做标记
  constructor() { }
  ngOnInit() {
    this.addRoot();
  }
  addRoot() {
    for (let index = 0; index < this.testData.length; index++) {
      if (this.testData[index].parentId === 0) {
        this.expandData.push(this.testData[index]);
      }
    }
  }
  changeNodeStatus(data) {
    data.expand = !data.expand;
    if (data.expand) {
      this.expandNode(data.id);
    } else {
      this.collect(data.id);
    }
  }
  expandNode(id) {
    // 找到插入点
    let tempindex = -1;
    const length = this.expandData.length;
    for (let i = 0; i < length; i++) {
      if (id === this.expandData[i].id) {
        tempindex = i + 1;
        break;
      }
    }
    for (let index = 0; index < this.testData.length; index++) {
      if (this.testData[index].parentId === id) {
        this.expandData.splice(tempindex, 0, this.testData[index]);
      }
    }
    console.log(this.expandData);
  }
  collect(id) {
    this.mark = [];
    this._mark(id);
    const temp = [];
    for (let index = 0; index < this.expandData.length; index++) {
      const element = this.expandData[index];
      if (this.mark.indexOf(element.id) < 0){
        temp.push(element);
      } else {
        element.expand = false;
      }
    }
    this.expandData = [];
    this.expandData = temp;
  }
  _mark(id) {
    for (let index = 0; index < this.expandData.length; index++) {
      const element = this.expandData[index];
      if (id === element.parentId) {
        if (!element.isLastLeaf) {
          this._mark(element.id);
        }
        this.mark.push(element.id);
      }
    }
  }
  changeSelectStatus(item) {
    // 先判断当前点击是哪种节点 0 根节点  1中间节点 2末级节点
    let nodeNum;
    if (item.parentId === 0) {
      nodeNum = 0;
    } else if (item.isLastLeaf) {
      nodeNum = 2;
    } else {
      nodeNum = 1;
    }
    if (nodeNum === 0) {
      if (item.selectStatus === 0) {
        this.getSelectByRootNode(2, item.id, this.testData);
      } else if (item.selectStatus === 1) {
        this.getSelectByRootNode(0, item.id, this.testData);
      } else {
        this.getSelectByRootNode(0, item.id, this.testData);
      }
    }
    if (nodeNum === 1) {
      if (item.selectStatus === 0) {
        this.getSelectByMidNode(2, item.id, this.testData);
        this.getSelectParentByMidNode(item.parentId, this.testData);
      } else if (item.selectStatus === 1) {
        this.getSelectByMidNode(0, item.id, this.testData);
        this. getSelectParentByMidNode(item.parentId, this.testData);
      } else {
        this.getSelectByMidNode(0, item.id, this.testData);
        this.getSelectParentByMidNode(item.parentId, this.testData);
      }
    }
    if (nodeNum === 2) {
      if (item.selectStatus === 0) {
        item.selectStatus = 2;
        this.getSelectParentByLeafNode(item.parentId, this.testData);
      }  else {
        item.selectStatus = 0;
        this.getSelectParentByLeafNode(item.parentId, this.testData);
      }
    }
  }
  getSelectByRootNode(index, id, handData) {
    for (let i = 0; i < handData.length; i++) {
      const element = handData[i];
      if (element.id === id) {
        element.selectStatus = index;
      }
      if (element.parentId === id) {
        element.selectStatus = index;
         if (!element.isLastLeaf) {
           this.getSelectByRootNode(index, element.id, handData);
         }
      }
    }
  }
  getSelectByMidNode(index, id, handData) {
    //  先改变自己和子节点
    for (let i = 0; i < handData.length; i++) {
      const element = handData[i];
      if (element.id === id) {
        element.selectStatus = index;
      }
      if (element.parentId === id) {
        element.selectStatus = index;
        if (!element.isLastLeaf) {
          this.getSelectByRootNode(index, element.id, handData);
        }
      }
    }

  }
  getSelectParentByMidNode(parentId, handData) {
    let selectChildNum = 0;
    let halfSelectChild = 0;
    let tempNode;
    for (let index = 0; index < handData.length; index++) {
      const element = handData[index];
      if (element.id === parentId) {
        tempNode = element;
      }
      if (element.parentId === parentId) {
        if (element.selectStatus === 2) {
          selectChildNum++;
        }
        if (element.selectStatus === 1) {
          halfSelectChild++;
        }
      }
    }
    if (halfSelectChild !== 0) {
      tempNode.selectStatus = 1;
    } else if (selectChildNum === 0) {
      tempNode.selectStatus = 0;
    } else if (selectChildNum !== 0) {
      const arr  = handData.filter((item) => {
        return item.parentId === tempNode.id;
      });
      if (arr.length === selectChildNum) {
        tempNode.selectStatus = 2;
      } else {
        tempNode.selectStatus = 1;
      }
    }
    if (tempNode.parentId !== 0) {
      this.getSelectParentByMidNode(tempNode.parentId, handData);
    }
  }
  getSelectParentByLeafNode(parentId, handData) {
    let selectChildNum = 0;
    let halfSelectChild = 0;
    let tempNode;
    for (let index = 0; index < handData.length; index++) {
      const element = handData[index];
      if (element.id === parentId) {
        tempNode = element;
      }
      if (element.parentId === parentId) {
        if (element.selectStatus === 2) {
          selectChildNum++;
        }
        if (element.selectStatus === 1) {
          halfSelectChild++;
        }
      }
    }
    if (halfSelectChild !== 0) {
      tempNode.selectStatus = 1;
    } else if (selectChildNum === 0) {
      tempNode.selectStatus = 0;
    } else if (selectChildNum !== 0) {
      const arr  = handData.filter((item) => {
        return item.parentId === tempNode.id;
      });
      if (arr.length === selectChildNum) {
        tempNode.selectStatus = 2;
      } else {
        tempNode.selectStatus = 1;
      }
    }
    if (tempNode.parentId !== 0) {
      this.getSelectParentByLeafNode(tempNode.parentId, handData);
    }
  }
}
