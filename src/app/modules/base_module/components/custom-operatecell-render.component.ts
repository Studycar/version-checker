import { Component, ViewChild, ViewContainerRef, Compiler, NgModule, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { SharedModule } from '@shared/shared.module';

/*
author:liujian11
date:2019-01-16
function:ag-grid 操作区自定义render
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-operatecell-render',
  template: `<span class="agGridCellFont operatecell">
                  <ng-container
                    *ngTemplateOutlet="template; context: templateContext">
                  </ng-container>
             </span>`,
})
export class CustomOperateCellRenderComponent implements ICellRendererAngularComp {
  // @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;
  // public params: any;
  // public context: any;
  // public dataItem: any;

  template: TemplateRef<any>;
  templateContext: { $implicit: any, params: any };

  constructor(private compiler: Compiler) {
  }

  agInit(params: any): void {
    this.template = params.customTemplate;
    this.refresh(params);
    // this.addComponent(this.customTemplate, { ctx: this.context, dataItem: this.dataItem, params });
  }

  refresh(params: any): boolean {
    this.templateContext = {
      $implicit: params.data,
      params,
    };
    return true;
  }

  /* 以下为动态生成component代码*/
/*  private addComponent(template: string, properties: any = {}) {
    @Component({ template })
    class TemplateComponent {
      public ctx: any;
    }

    @NgModule({
      imports: [SharedModule],
      declarations: [TemplateComponent],
    })
    class TemplateModule {
    }

    const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
    const factory = mod.componentFactories.find((comp) =>
      comp.componentType === TemplateComponent,
    );
    this.container.clear();
    const component = this.container.createComponent(factory);
    Object.assign(component.instance, properties);
    // If properties are changed at a later stage, the change detection
    // may need to be triggered manually:
    // component.changeDetectorRef.detectChanges();
  }*/
}
