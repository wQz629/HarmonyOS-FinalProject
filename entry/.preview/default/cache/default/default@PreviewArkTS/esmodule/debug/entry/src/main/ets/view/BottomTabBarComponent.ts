if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BottomTabBar_Params {
    currentIndex?: number;
    currentThemeColors?: ThemeColors;
    tabBarData?: TabBarItem[];
}
import { BOTTOM_TAB_BAR_HEIGHT, TAB_ICON_SIZE, TAB_FONT_SIZE, LAYOUT_WIDTH_OR_HEIGHT } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
import { DEFAULT_THEME } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
import type { ThemeColors } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
export interface TabBarItem {
    title: Resource;
    icon: Resource;
    selectedIcon: Resource;
    index: number;
}
export default class BottomTabBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new SynchedPropertySimpleTwoWayPU(params.currentIndex, this, "currentIndex");
        this.__currentThemeColors = this.createStorageLink('themeColors', DEFAULT_THEME, "currentThemeColors");
        this.tabBarData = [
            {
                title: { "id": 16777254, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                icon: { "id": 16777218, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                selectedIcon: { "id": 16777303, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                index: 0
            },
            {
                title: { "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                icon: { "id": 16777304, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                selectedIcon: { "id": 16777311, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                index: 1
            },
            {
                title: { "id": 16777284, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                icon: { "id": 16777221, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                selectedIcon: { "id": 16777315, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                index: 2
            },
            {
                title: { "id": 16777266, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                icon: { "id": 16777317, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                selectedIcon: { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" },
                index: 3
            }
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BottomTabBar_Params) {
        if (params.tabBarData !== undefined) {
            this.tabBarData = params.tabBarData;
        }
    }
    updateStateVars(params: BottomTabBar_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__currentThemeColors.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__currentThemeColors.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: SynchedPropertySimpleTwoWayPU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __currentThemeColors: ObservedPropertyAbstractPU<ThemeColors>; //使用 @StorageLink 确保当 PersonalPage 改变主题时，这里会自动刷新
    get currentThemeColors() {
        return this.__currentThemeColors.get();
    }
    set currentThemeColors(newValue: ThemeColors) {
        this.__currentThemeColors.set(newValue);
    }
    private tabBarData: TabBarItem[];
    TabBarItemBuilder(item: TabBarItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/view/BottomTabBarComponent.ets(65:5)", "entry");
            Column.layoutWeight(1);
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => {
                this.currentIndex = item.index;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.currentIndex === item.index ? item.selectedIcon : item.icon);
            Image.debugLine("entry/src/main/ets/view/BottomTabBarComponent.ets(66:7)", "entry");
            Image.width(TAB_ICON_SIZE);
            Image.height(TAB_ICON_SIZE);
            Image.objectFit(ImageFit.Contain);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.title);
            Text.debugLine("entry/src/main/ets/view/BottomTabBarComponent.ets(71:7)", "entry");
            Text.fontSize(TAB_FONT_SIZE);
            Text.fontColor(this.currentIndex === item.index ? this.currentThemeColors.tabSelectedColor : this.currentThemeColors.tabUnselectedColor);
            Text.fontWeight(this.currentIndex === item.index ? FontWeight.Medium : FontWeight.Normal);
        }, Text);
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/BottomTabBarComponent.ets(84:5)", "entry");
            Row.width(LAYOUT_WIDTH_OR_HEIGHT);
            Row.height(BOTTOM_TAB_BAR_HEIGHT);
            Row.backgroundColor(this.currentThemeColors.cardBackgroundColor);
            Row.justifyContent(FlexAlign.SpaceAround);
            Row.alignItems(VerticalAlign.Center);
            Row.shadow({
                radius: 8,
                color: '#00000015',
                offsetY: -2
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.TabBarItemBuilder.bind(this)(item);
            };
            this.forEachUpdateFunction(elmtId, this.tabBarData, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
