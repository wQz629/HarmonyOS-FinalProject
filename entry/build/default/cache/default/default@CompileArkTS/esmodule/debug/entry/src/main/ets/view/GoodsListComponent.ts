if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface GoodsList_Params {
    compareList?: GoodsListItemType[];
    currentThemeColors?: ThemeColors;
    goodsListData?: ListDataSource;
    startTouchOffsetY?: number;
    endTouchOffsetY?: number;
}
import * as commonConst from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
import type { GoodsListItemType } from '../viewmodel/InitialData';
import { ListDataSource } from "@bundle:com.example.list_harmony/entry/ets/viewmodel/ListDataSource";
import { DEFAULT_THEME } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
import type { ThemeColors } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
export default class GoodsList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__compareList = this.createStorageLink('compareList', [], "compareList");
        this.__currentThemeColors = this.createStorageLink('themeColors', DEFAULT_THEME, "currentThemeColors");
        this.__goodsListData = new ObservedPropertyObjectPU(new ListDataSource(), this, "goodsListData");
        this.addProvidedVar("goodsListData", this.__goodsListData, false);
        this.startTouchOffsetY = 0;
        this.endTouchOffsetY = 0;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: GoodsList_Params) {
        if (params.goodsListData !== undefined) {
            this.goodsListData = params.goodsListData;
        }
        if (params.startTouchOffsetY !== undefined) {
            this.startTouchOffsetY = params.startTouchOffsetY;
        }
        if (params.endTouchOffsetY !== undefined) {
            this.endTouchOffsetY = params.endTouchOffsetY;
        }
    }
    updateStateVars(params: GoodsList_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__compareList.purgeDependencyOnElmtId(rmElmtId);
        this.__currentThemeColors.purgeDependencyOnElmtId(rmElmtId);
        this.__goodsListData.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__compareList.aboutToBeDeleted();
        this.__currentThemeColors.aboutToBeDeleted();
        this.__goodsListData.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 👇 1. 链接全局对比列表，初始化为空数组
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
    private __goodsListData: ObservedPropertyObjectPU<ListDataSource>;
    get goodsListData() {
        return this.__goodsListData.get();
    }
    set goodsListData(newValue: ListDataSource) {
        this.__goodsListData.set(newValue);
    }
    private startTouchOffsetY: number;
    private endTouchOffsetY: number;
    // 判断商品是否已在对比列表中
    isInCompareList(item: GoodsListItemType): boolean {
        return this.compareList.some(compareItem => compareItem.id === item.id);
    }
    // 处理对比点击
    handleCompare(item: GoodsListItemType) {
        if (this.isInCompareList(item)) {
            // 如果已存在，则移除
            this.compareList = this.compareList.filter(compareItem => compareItem.id !== item.id);
        }
        else {
            // 如果不存在，判断是否超过限制 (比如最多2个)
            if (this.compareList.length >= 2) {
                promptAction.showToast({ message: '最多同时对比两个商品' });
                return;
            }
            // 加入对比
            this.compareList.push(item);
            promptAction.showToast({ message: '已加入对比' });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.BottomEnd });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.justifyContent(FlexAlign.Center);
            Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ space: commonConst.LIST_ITEM_SPACE });
            List.width(commonConst.GOODS_LIST_WIDTH);
            List.divider({ strokeWidth: 1, color: this.currentThemeColors.dividerColor });
        }, List);
        {
            const __lazyForEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(() => { }, false);
                        ListItem.onClick(() => {
                            router.pushUrl({
                                url: 'pages/GoodsDetailPage',
                                params: {
                                    goodsId: item.id,
                                    goodsName: item.goodsName,
                                    goodsPrice: item.price,
                                    goodsImg: item.goodsImg
                                }
                            });
                        });
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, ListItem);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.justifyContent(FlexAlign.SpaceBetween);
                            Row.height(commonConst.GOODS_LIST_HEIGHT);
                            Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // ... 原有的图片 Column ...
                            Column.create();
                            // ... 原有的图片 Column ...
                            Column.width(commonConst.GOODS_IMAGE_WIDTH);
                            // ... 原有的图片 Column ...
                            Column.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Image.create(item?.goodsImg);
                            Image.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                            Image.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                            Image.draggable(false);
                        }, Image);
                        // ... 原有的图片 Column ...
                        Column.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.padding(commonConst.GOODS_LIST_PADDING);
                            Column.width(commonConst.GOODS_FONT_WIDTH);
                            Column.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                            Column.justifyContent(FlexAlign.SpaceBetween);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item?.goodsName);
                            Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                            Text.fontColor(this.currentThemeColors.primaryTextColor);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item?.advertisingLanguage);
                            Text.fontColor(this.currentThemeColors.primaryTextColor);
                            Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
                            Text.margin({ right: commonConst.MARGIN_RIGHT });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.justifyContent(FlexAlign.SpaceBetween);
                            Row.width('100%');
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 价格和评价
                            Column.create();
                            // 价格和评价
                            Column.alignItems(HorizontalAlign.Start);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item?.evaluate);
                            Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
                            Text.fontColor(this.currentThemeColors.accentColor);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item?.price);
                            Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                            Text.fontColor(this.currentThemeColors.accentColor);
                        }, Text);
                        Text.pop();
                        // 价格和评价
                        Column.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 👇 2. 新增：对比图标/按钮
                            Image.create(this.isInCompareList(item) ? { "id": 16777318, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } : { "id": 16777319, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                            // 👇 2. 新增：对比图标/按钮
                            Image.width(24);
                            // 👇 2. 新增：对比图标/按钮
                            Image.height(24);
                            Gesture.create(GesturePriority.Low);
                            TapGesture.create();
                            TapGesture.onAction(() => {
                                // TapGesture 默认会消费事件，通常不会冒泡给父组件的 onClick
                                this.handleCompare(item);
                            });
                            TapGesture.pop();
                            Gesture.pop();
                        }, Image);
                        Row.pop();
                        Column.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    observedDeepRender();
                }
            };
            LazyForEach.create("1", this, this.goodsListData, __lazyForEachItemGenFunction);
            LazyForEach.pop();
        }
        List.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 👇 3. 新增：进入对比页面的悬浮入口
            if (this.compareList.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(`开始对比 (${this.compareList.length})`);
                        Button.backgroundColor(this.currentThemeColors.accentColor);
                        Button.fontColor(Color.White);
                        Button.margin({ bottom: 80, right: 20 });
                        Button.onClick(() => {
                            if (this.compareList.length < 2) {
                                promptAction.showToast({ message: '请至少选择两个商品进行对比' });
                                return;
                            }
                            router.pushUrl({ url: 'pages/ComparisonPage' });
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
