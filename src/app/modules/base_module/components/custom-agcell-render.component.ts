import { Component, ViewChild, ViewContainerRef, Compiler, NgModule } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { SharedModule } from '@shared/shared.module';
/*
author:liujian11
date:2019-01-16
function:ag-grid ag Cell自定义render
*/
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'custom-agcell-render',
    template: `<span #container class="agGridCellFont">

               </span>`,
})
export class CustomAgCellRenderComponent implements ICellRendererAngularComp {
    @ViewChild('container', {static: true, read: ViewContainerRef }) container: ViewContainerRef;
    public params: any;
    public context: any;
    public dataItem: any;
    public customTemplate: any;
    constructor(private compiler: Compiler) { }
    agInit(params: any): void {
        this.params = params;
        this.context = params.context;
        this.dataItem = params.data;
        this.customTemplate = params.customTemplate;
        this.addComponent(this.customTemplate, { ctx: this.context, dataItem: this.dataItem });
    }

    refresh(): boolean {
        return false;
    }

    /* 以下为动态生成component代码*/
    private addComponent(template: string, properties: any = {}) {
        @Component({ template })
        class TemplateComponent {
            public ctx: any;
        }

        @NgModule({
            imports: [SharedModule],
            declarations: [TemplateComponent]
        })
        class TemplateModule { }

        const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
        const factory = mod.componentFactories.find((comp) =>
            comp.componentType === TemplateComponent
        );
        this.container.clear();
        const component = this.container.createComponent(factory);
        Object.assign(component.instance, properties);
    }
}
