if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface GoodsList_Params {
    compareList?: GoodsListItemType[];
    currentThemeColors?: ThemeColors;
    goodsListData?: ListDataSource;
    layoutMode?: 'list' | 'grid';
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
        this.__goodsListData = new ObservedPropertyObjectPU(ListDataSource.getInstance(), this, "goodsListData");
        this.addProvidedVar("goodsListData", this.__goodsListData, false);
        this.__layoutMode = new SynchedPropertySimpleOneWayPU(params.layoutMode, this, "layoutMode");
        this.startTouchOffsetY = 0;
        this.endTouchOffsetY = 0;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: GoodsList_Params) {
        if (params.goodsListData !== undefined) {
            this.goodsListData = params.goodsListData;
        }
        if (params.layoutMode === undefined) {
            this.__layoutMode.set('list');
        }
        if (params.startTouchOffsetY !== undefined) {
            this.startTouchOffsetY = params.startTouchOffsetY;
        }
        if (params.endTouchOffsetY !== undefined) {
            this.endTouchOffsetY = params.endTouchOffsetY;
        }
    }
    updateStateVars(params: GoodsList_Params) {
        this.__layoutMode.reset(params.layoutMode);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__compareList.purgeDependencyOnElmtId(rmElmtId);
        this.__currentThemeColors.purgeDependencyOnElmtId(rmElmtId);
        this.__goodsListData.purgeDependencyOnElmtId(rmElmtId);
        this.__layoutMode.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__compareList.aboutToBeDeleted();
        this.__currentThemeColors.aboutToBeDeleted();
        this.__goodsListData.aboutToBeDeleted();
        this.__layoutMode.aboutToBeDeleted();
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
    private __goodsListData: ObservedPropertyObjectPU<ListDataSource>;
    get goodsListData() {
        return this.__goodsListData.get();
    }
    set goodsListData(newValue: ListDataSource) {
        this.__goodsListData.set(newValue);
    }
    private __layoutMode: SynchedPropertySimpleOneWayPU<'list' | 'grid'>; // 添加布局模式属性
    get layoutMode() {
        return this.__layoutMode.get();
    }
    set layoutMode(newValue: 'list' | 'grid') {
        this.__layoutMode.set(newValue);
    }
    private startTouchOffsetY: number;
    private endTouchOffsetY: number;
    // 将商品数据按两列分组（用于网格布局）
    private groupItems(data: ListDataSource): GoodsListItemType[][] {
        let rows: GoodsListItemType[][] = [];
        for (let i = 0; i < data.totalCount(); i += 2) {
            let row: GoodsListItemType[] = [];
            let item1 = data.getData(i);
            if (item1)
                row.push(item1);
            if (i + 1 < data.totalCount()) {
                let item2 = data.getData(i + 1);
                if (item2)
                    row.push(item2);
            }
            if (row.length > 0)
                rows.push(row);
        }
        return rows;
    }
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
                try {
                    promptAction.showToast({ message: '最多同时对比两个商品' });
                }
                catch (_) {
                    // 处理异常
                }
                return;
            }
            // 加入对比
            this.compareList.push(item);
            try {
                promptAction.showToast({ message: '已加入对比' });
            }
            catch (_) {
                // 处理异常
            }
        }
    }
    GoodsItem(item: GoodsListItemType, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(80:5)", "entry");
            Column.padding(8);
            Column.backgroundColor(this.currentThemeColors.cardBackgroundColor);
            Column.borderRadius(8);
            Column.width('48%');
            Column.onClick(() => {
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
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(item?.goodsImg);
            Image.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(81:7)", "entry");
            Image.width(140);
            Image.height(140);
            Image.draggable(false);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item?.goodsName);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(86:7)", "entry");
            Text.fontSize(commonConst.NORMAL_FONT_SIZE);
            Text.fontColor(this.currentThemeColors.primaryTextColor);
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item?.advertisingLanguage);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(91:7)", "entry");
            Text.fontColor(this.currentThemeColors.primaryTextColor);
            Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(96:7)", "entry");
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ top: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item?.evaluate);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(97:9)", "entry");
            Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
            Text.fontColor(this.currentThemeColors.accentColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item?.price);
            Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(100:9)", "entry");
            Text.fontSize(commonConst.NORMAL_FONT_SIZE);
            Text.fontColor(this.currentThemeColors.accentColor);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.layoutMode === 'list') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 平铺布局（原有布局）
                        Stack.create({ alignContent: Alignment.BottomEnd });
                        Stack.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(127:7)", "entry");
                        // 平铺布局（原有布局）
                        Stack.width('100%');
                        // 平铺布局（原有布局）
                        Stack.height('100%');
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(128:9)", "entry");
                        Row.justifyContent(FlexAlign.Center);
                        Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: commonConst.LIST_ITEM_SPACE });
                        List.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(129:11)", "entry");
                        List.width(commonConst.GOODS_LIST_WIDTH);
                        List.divider({ strokeWidth: 1, color: this.currentThemeColors.dividerColor });
                    }, List);
                    {
                        const __lazyForEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(() => { }, false);
                                    ListItem.onTouch((event?: TouchEvent) => {
                                        if (event === undefined) {
                                            return;
                                        }
                                        switch (event.type) {
                                            case TouchType.Down:
                                                this.startTouchOffsetY = event.touches[0].y;
                                                break;
                                            case TouchType.Up:
                                                this.startTouchOffsetY = event.touches[0].y;
                                                break;
                                            case TouchType.Move:
                                                if (this.startTouchOffsetY - this.endTouchOffsetY > 0) {
                                                    this.goodsListData.pushData();
                                                }
                                                break;
                                        }
                                    });
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
                                    ListItem.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(131:15)", "entry");
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, ListItem);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(132:17)", "entry");
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                        Row.height(commonConst.GOODS_LIST_HEIGHT);
                                        Row.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(133:19)", "entry");
                                        Column.width(commonConst.GOODS_IMAGE_WIDTH);
                                        Column.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create(item?.goodsImg);
                                        Image.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(134:21)", "entry");
                                        Image.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                                        Image.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                                        Image.draggable(false);
                                    }, Image);
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(142:19)", "entry");
                                        Column.padding(commonConst.GOODS_LIST_PADDING);
                                        Column.width(commonConst.GOODS_FONT_WIDTH);
                                        Column.height(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                                        Column.justifyContent(FlexAlign.SpaceBetween);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item?.goodsName);
                                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(143:21)", "entry");
                                        Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                        Text.fontColor(this.currentThemeColors.primaryTextColor);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item?.advertisingLanguage);
                                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(147:21)", "entry");
                                        Text.fontColor(this.currentThemeColors.primaryTextColor);
                                        Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
                                        Text.margin({ right: commonConst.MARGIN_RIGHT });
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(152:21)", "entry");
                                        Row.justifyContent(FlexAlign.SpaceBetween);
                                        Row.width('100%');
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 价格和评价
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(154:23)", "entry");
                                        // 价格和评价
                                        Column.alignItems(HorizontalAlign.Start);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item?.evaluate);
                                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(155:25)", "entry");
                                        Text.fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE);
                                        Text.fontColor(this.currentThemeColors.accentColor);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item?.price);
                                        Text.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(158:25)", "entry");
                                        Text.fontSize(commonConst.NORMAL_FONT_SIZE);
                                        Text.fontColor(this.currentThemeColors.accentColor);
                                    }, Text);
                                    Text.pop();
                                    // 价格和评价
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        // 对比图标/按钮
                                        Image.create(this.isInCompareList(item) ? { "id": 16777320, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" } : { "id": 16777318, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                        Image.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(165:23)", "entry");
                                        // 对比图标/按钮
                                        Image.width(24);
                                        // 对比图标/按钮
                                        Image.height(24);
                                        Gesture.create(GesturePriority.Low);
                                        TapGesture.create();
                                        TapGesture.onAction(() => {
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
                        // 悬浮的进入对比页面按钮
                        if (this.compareList.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel(`开始对比 (${this.compareList.length})`);
                                    Button.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(226:11)", "entry");
                                    Button.backgroundColor(this.currentThemeColors.accentColor);
                                    Button.fontColor('#FFFFFF');
                                    Button.margin({ bottom: 80, right: 20 });
                                    Button.onClick(() => {
                                        if (this.compareList.length < 2) {
                                            try {
                                                promptAction.showToast({ message: '请至少选择两个商品进行对比' });
                                            }
                                            catch (_) {
                                                // 处理异常
                                            }
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
                    // 平铺布局（原有布局）
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 2列网格布局
                        Column.create();
                        Column.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(247:7)", "entry");
                        // 2列网格布局
                        Column.width(commonConst.LAYOUT_WIDTH_OR_HEIGHT);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const row = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create({ space: 8 });
                                Row.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(249:11)", "entry");
                                Row.padding({ left: 8, right: 8 });
                            }, Row);
                            this.GoodsItem.bind(this)(row[0]);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (row.length > 1) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.GoodsItem.bind(this)(row[1]);
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Blank.create();
                                            Blank.debugLine("entry/src/main/ets/view/GoodsListComponent.ets(254:15)", "entry");
                                        }, Blank);
                                        Blank.pop();
                                    });
                                }
                            }, If);
                            If.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.groupItems(ObservedObject.GetRawObject(this.goodsListData)), forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    // 2列网格布局
                    Column.pop();
                });
            }
        }, If);
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
