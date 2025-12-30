if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SearchBar_Params {
    searchText?: string;
    placeholder?: Resource;
    currentThemeColors?: ThemeColors;
    onSearchClick?: () => void;
    onClearClick?: () => void;
}
import { LAYOUT_WIDTH_OR_HEIGHT, NORMAL_FONT_SIZE, SMALL_ICON_SIZE, INPUT_HEIGHT, INPUT_BORDER_RADIUS, INPUT_PADDING } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
import { DEFAULT_THEME } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
import type { ThemeColors } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
export default class SearchBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new SynchedPropertySimpleTwoWayPU(params.searchText, this, "searchText");
        this.__placeholder = new ObservedPropertyObjectPU({ "id": 16777268, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" }, this, "placeholder");
        this.__currentThemeColors = this.createStorageLink('themeColors', DEFAULT_THEME, "currentThemeColors");
        this.onSearchClick = undefined;
        this.onClearClick = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SearchBar_Params) {
        if (params.placeholder !== undefined) {
            this.placeholder = params.placeholder;
        }
        if (params.onSearchClick !== undefined) {
            this.onSearchClick = params.onSearchClick;
        }
        if (params.onClearClick !== undefined) {
            this.onClearClick = params.onClearClick;
        }
    }
    updateStateVars(params: SearchBar_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__placeholder.purgeDependencyOnElmtId(rmElmtId);
        this.__currentThemeColors.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__placeholder.aboutToBeDeleted();
        this.__currentThemeColors.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __searchText: SynchedPropertySimpleTwoWayPU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __placeholder: ObservedPropertyObjectPU<Resource>;
    get placeholder() {
        return this.__placeholder.get();
    }
    set placeholder(newValue: Resource) {
        this.__placeholder.set(newValue);
    }
    private __currentThemeColors: ObservedPropertyAbstractPU<ThemeColors>;
    get currentThemeColors() {
        return this.__currentThemeColors.get();
    }
    set currentThemeColors(newValue: ThemeColors) {
        this.__currentThemeColors.set(newValue);
    }
    private onSearchClick?: () => void;
    private onClearClick?: () => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width(LAYOUT_WIDTH_OR_HEIGHT);
            Row.height(INPUT_HEIGHT);
            Row.backgroundColor(this.currentThemeColors.backgroundColor);
            Row.borderRadius(INPUT_BORDER_RADIUS);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索图标
            Image.create({ "id": 16777316, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 搜索图标
            Image.width(SMALL_ICON_SIZE);
            // 搜索图标
            Image.height(SMALL_ICON_SIZE);
            // 搜索图标
            Image.margin({ left: INPUT_PADDING });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索输入框
            TextInput.create({ text: this.searchText, placeholder: this.placeholder });
            // 搜索输入框
            TextInput.layoutWeight(1);
            // 搜索输入框
            TextInput.height(INPUT_HEIGHT);
            // 搜索输入框
            TextInput.fontSize(NORMAL_FONT_SIZE);
            // 搜索输入框
            TextInput.placeholderColor(this.currentThemeColors.secondaryTextColor);
            // 搜索输入框
            TextInput.backgroundColor(this.currentThemeColors.backgroundColor);
            // 搜索输入框
            TextInput.onChange((value: string) => {
                this.searchText = value;
            });
            // 搜索输入框
            TextInput.onSubmit(() => {
                if (this.onSearchClick) {
                    this.onSearchClick();
                }
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 清空按钮
            if (this.searchText.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777306, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                        Image.width(SMALL_ICON_SIZE);
                        Image.height(SMALL_ICON_SIZE);
                        Image.onClick(() => {
                            this.searchText = '';
                            if (this.onClearClick) {
                                this.onClearClick();
                            }
                        });
                    }, Image);
                });
            }
            // 搜索按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索按钮
            Button.createWithLabel({ "id": 16777266, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 搜索按钮
            Button.fontSize(NORMAL_FONT_SIZE);
            // 搜索按钮
            Button.fontColor(this.currentThemeColors.primaryTextColor);
            // 搜索按钮
            Button.backgroundColor(this.currentThemeColors.accentColor);
            // 搜索按钮
            Button.height(INPUT_HEIGHT - 8);
            // 搜索按钮
            Button.padding({ left: 16, right: 16 });
            // 搜索按钮
            Button.margin({ right: 8 });
            // 搜索按钮
            Button.onClick(() => {
                if (this.onSearchClick) {
                    this.onSearchClick();
                }
            });
        }, Button);
        // 搜索按钮
        Button.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
