if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ComparisonPage_Params {
    compareList?: GoodsListItemType[];
    currentThemeColors?: ThemeColors;
}
import router from "@ohos:router";
import type { GoodsListItemType } from '../viewmodel/InitialData';
import { DEFAULT_THEME } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
import type { ThemeColors } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
class ComparisonPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__compareList = this.createStorageLink('compareList', [], "compareList");
        this.__currentThemeColors = this.createStorageLink('themeColors', DEFAULT_THEME, "currentThemeColors");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ComparisonPage_Params) {
    }
    updateStateVars(params: ComparisonPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__compareList.purgeDependencyOnElmtId(rmElmtId);
        this.__currentThemeColors.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__compareList.aboutToBeDeleted();
        this.__currentThemeColors.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __compareList: ObservedPropertyAbstractPU<GoodsListItemType[]>;
    get compareList() {
        return this.__compareList.get();
    }
    set compareList(newValue: GoodsListItemType[]) {
        this.__compareList.set(newValue);
    }
    private __currentThemeColors: ObservedPropertyAbstractPU<ThemeColors>;
    get currentThemeColors() {
        return this.__currentThemeColors.get();
    }
    set currentThemeColors(newValue: ThemeColors) {
        this.__currentThemeColors.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.currentThemeColors.backgroundColor);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 1. 顶部导航栏
            Row.create();
            // 1. 顶部导航栏
            Row.width('100%');
            // 1. 顶部导航栏
            Row.height(50);
            // 1. 顶部导航栏
            Row.padding({ left: 16, right: 16 });
            // 1. 顶部导航栏
            Row.margin({ top: 36 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.fontSize(24);
            Text.fontColor(this.currentThemeColors.primaryTextColor);
            Text.onClick(() => router.back());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('商品对比');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.currentThemeColors.primaryTextColor);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 占位，保持标题居中
            Text.create('  ');
            // 占位，保持标题居中
            Text.fontSize(24);
        }, Text);
        // 占位，保持标题居中
        Text.pop();
        // 1. 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 2. 对比内容区域
            if (this.compareList.length < 2) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 异常处理：数据不足
                        Column.create();
                        // 异常处理：数据不足
                        Column.height('100%');
                        // 异常处理：数据不足
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请选择两个商品进行对比');
                    }, Text);
                    Text.pop();
                    // 异常处理：数据不足
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.layoutWeight(1);
                        Row.alignItems(VerticalAlign.Top);
                    }, Row);
                    // 左侧商品
                    this.GoodsColumn.bind(this)(this.compareList[0]);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 中间分割线
                        Divider.create();
                        // 中间分割线
                        Divider.vertical(true);
                        // 中间分割线
                        Divider.height('80%');
                        // 中间分割线
                        Divider.color(Color.Gray);
                    }, Divider);
                    // 右侧商品
                    this.GoodsColumn.bind(this)(this.compareList[1]);
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // 抽取单个商品展示列
    GoodsColumn(item: GoodsListItemType, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('50%');
            Column.height('100%');
            Column.padding(10);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片
            Image.create(item.goodsImg);
            // 图片
            Image.width('80%');
            // 图片
            Image.aspectRatio(1);
            // 图片
            Image.objectFit(ImageFit.Contain);
            // 图片
            Image.margin({ top: 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 名称
            Text.create(item.goodsName);
            // 名称
            Text.fontSize(18);
            // 名称
            Text.fontWeight(FontWeight.Bold);
            // 名称
            Text.fontColor(this.currentThemeColors.primaryTextColor);
            // 名称
            Text.textAlign(TextAlign.Center);
        }, Text);
        // 名称
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 价格
            Text.create('价格');
            // 价格
            Text.fontSize(14);
            // 价格
            Text.fontColor(Color.Gray);
        }, Text);
        // 价格
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.price);
            Text.fontSize(20);
            Text.fontColor(this.currentThemeColors.accentColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评价
            Text.create('用户评价');
            // 评价
            Text.fontSize(14);
            // 评价
            Text.fontColor(Color.Gray);
        }, Text);
        // 评价
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.evaluate);
            Text.fontSize(16);
            Text.fontColor(this.currentThemeColors.primaryTextColor);
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ComparisonPage";
    }
}
registerNamedRoute(() => new ComparisonPage(undefined, {}), "", { bundleName: "com.example.list_harmony", moduleName: "entry", pagePath: "pages/ComparisonPage", pageFullPath: "entry/src/main/ets/pages/ComparisonPage", integratedHsp: "false", moduleType: "followWithHap" });
