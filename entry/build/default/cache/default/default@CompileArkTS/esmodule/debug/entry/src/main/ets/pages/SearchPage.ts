if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SearchPage_Params {
    searchText?: string;
    isSearching?: boolean;
    searchHistory?: string[];
    hotSearchList?: string[];
    searchResults?: number;
    currentThemeColors?: ThemeColors;
}
import SearchBar from "@bundle:com.example.list_harmony/entry/ets/view/SearchBarComponent";
import GoodsList from "@bundle:com.example.list_harmony/entry/ets/view/GoodsListComponent";
import { LAYOUT_WIDTH_OR_HEIGHT, NORMAL_FONT_SIZE, SMALL_FONT_SIZE, NAV_BAR_HEIGHT } from "@bundle:com.example.list_harmony/entry/ets/common/CommonConstants";
import { DEFAULT_THEME } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
import type { ThemeColors } from "@bundle:com.example.list_harmony/entry/ets/common/Colors";
export default class SearchPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__isSearching = new ObservedPropertySimplePU(false, this, "isSearching");
        this.__searchHistory = new ObservedPropertyObjectPU(['手机', '笔记本', '耳机', '键盘'], this, "searchHistory");
        this.__hotSearchList = new ObservedPropertyObjectPU(['华为手机', '苹果手机', '小米手机', '蓝牙耳机', '机械键盘'], this, "hotSearchList");
        this.__searchResults = new ObservedPropertySimplePU(0, this, "searchResults");
        this.__currentThemeColors = this.createStorageLink('themeColors', DEFAULT_THEME, "currentThemeColors");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SearchPage_Params) {
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.isSearching !== undefined) {
            this.isSearching = params.isSearching;
        }
        if (params.searchHistory !== undefined) {
            this.searchHistory = params.searchHistory;
        }
        if (params.hotSearchList !== undefined) {
            this.hotSearchList = params.hotSearchList;
        }
        if (params.searchResults !== undefined) {
            this.searchResults = params.searchResults;
        }
    }
    updateStateVars(params: SearchPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__isSearching.purgeDependencyOnElmtId(rmElmtId);
        this.__searchHistory.purgeDependencyOnElmtId(rmElmtId);
        this.__hotSearchList.purgeDependencyOnElmtId(rmElmtId);
        this.__searchResults.purgeDependencyOnElmtId(rmElmtId);
        this.__currentThemeColors.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__isSearching.aboutToBeDeleted();
        this.__searchHistory.aboutToBeDeleted();
        this.__hotSearchList.aboutToBeDeleted();
        this.__searchResults.aboutToBeDeleted();
        this.__currentThemeColors.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __isSearching: ObservedPropertySimplePU<boolean>;
    get isSearching() {
        return this.__isSearching.get();
    }
    set isSearching(newValue: boolean) {
        this.__isSearching.set(newValue);
    }
    private __searchHistory: ObservedPropertyObjectPU<string[]>;
    get searchHistory() {
        return this.__searchHistory.get();
    }
    set searchHistory(newValue: string[]) {
        this.__searchHistory.set(newValue);
    }
    private __hotSearchList: ObservedPropertyObjectPU<string[]>;
    get hotSearchList() {
        return this.__hotSearchList.get();
    }
    set hotSearchList(newValue: string[]) {
        this.__hotSearchList.set(newValue);
    }
    private __searchResults: ObservedPropertySimplePU<number>;
    get searchResults() {
        return this.__searchResults.get();
    }
    set searchResults(newValue: number) {
        this.__searchResults.set(newValue);
    }
    private __currentThemeColors: ObservedPropertyAbstractPU<ThemeColors>; //使用 @StorageLink 确保当 PersonalPage 改变主题时，这里会自动刷新
    get currentThemeColors() {
        return this.__currentThemeColors.get();
    }
    set currentThemeColors(newValue: ThemeColors) {
        this.__currentThemeColors.set(newValue);
    }
    handleSearch() {
        if (this.searchText.trim().length === 0) {
            return;
        }
        // 添加到搜索历史
        if (!this.searchHistory.includes(this.searchText)) {
            this.searchHistory.unshift(this.searchText);
            if (this.searchHistory.length > 10) {
                this.searchHistory.pop();
            }
        }
        this.isSearching = true;
        // 模拟搜索结果数量
        this.searchResults = Math.floor(Math.random() * 100) + 20;
    }
    handleClear() {
        this.searchText = '';
        this.isSearching = false;
    }
    clearHistory() {
        this.searchHistory = [];
    }
    SearchHistoryBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(LAYOUT_WIDTH_OR_HEIGHT);
            Column.backgroundColor(this.currentThemeColors.backgroundColor);
            Column.margin({ top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索历史标题
            Row.create();
            // 搜索历史标题
            Row.width(LAYOUT_WIDTH_OR_HEIGHT);
            // 搜索历史标题
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777267, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            Text.fontSize(NORMAL_FONT_SIZE);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.currentThemeColors.primaryTextColor);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777229, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            Text.fontSize(SMALL_FONT_SIZE);
            Text.fontColor(this.currentThemeColors.secondaryTextColor);
            Text.onClick(() => {
                this.clearHistory();
            });
        }, Text);
        Text.pop();
        // 搜索历史标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 搜索历史列表
            if (this.searchHistory.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.divider({ strokeWidth: 1, color: this.currentThemeColors.dividerColor });
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.width(LAYOUT_WIDTH_OR_HEIGHT);
                                        Row.height(48);
                                        Row.padding({ left: 16, right: 16 });
                                        Row.onClick(() => {
                                            this.searchText = item;
                                            this.handleSearch();
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create({ "id": 16777310, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                        Image.width(20);
                                        Image.height(20);
                                    }, Image);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item);
                                        Text.fontSize(NORMAL_FONT_SIZE);
                                        Text.fontColor(this.currentThemeColors.primaryTextColor);
                                        Text.margin({ left: 12 });
                                        Text.layoutWeight(1);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create({ "id": 16777300, "type": 20000, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                                        Image.width(16);
                                        Image.height(16);
                                    }, Image);
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.searchHistory, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777250, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
                        Text.fontSize(SMALL_FONT_SIZE);
                        Text.fontColor(this.currentThemeColors.secondaryTextColor);
                        Text.margin({ top: 24 });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    HotSearchBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(LAYOUT_WIDTH_OR_HEIGHT);
            Column.backgroundColor(this.currentThemeColors.cardBackgroundColor);
            Column.margin({ top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 热门搜索标题
            Text.create({ "id": 16777244, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            // 热门搜索标题
            Text.fontSize(NORMAL_FONT_SIZE);
            // 热门搜索标题
            Text.fontWeight(FontWeight.Bold);
            // 热门搜索标题
            Text.fontColor(this.currentThemeColors.primaryTextColor);
            // 热门搜索标题
            Text.width(LAYOUT_WIDTH_OR_HEIGHT);
            // 热门搜索标题
            Text.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Text);
        // 热门搜索标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 热门搜索标签
            Flex.create({ wrap: FlexWrap.Wrap });
            // 热门搜索标签
            Flex.width(LAYOUT_WIDTH_OR_HEIGHT);
            // 热门搜索标签
            Flex.padding({ left: 16, right: 16, bottom: 16 });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item);
                    Text.fontSize(SMALL_FONT_SIZE);
                    Text.fontColor(this.currentThemeColors.secondaryTextColor);
                    Text.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    Text.backgroundColor(this.currentThemeColors.backgroundColor);
                    Text.borderRadius(16);
                    Text.margin({ right: 8, bottom: 8 });
                    Text.onClick(() => {
                        this.searchText = item;
                        this.handleSearch();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.hotSearchList, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 热门搜索标签
        Flex.pop();
        Column.pop();
    }
    SearchResultBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(LAYOUT_WIDTH_OR_HEIGHT);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索结果提示
            Row.create();
            // 搜索结果提示
            Row.width(LAYOUT_WIDTH_OR_HEIGHT);
            // 搜索结果提示
            Row.height(NAV_BAR_HEIGHT);
            // 搜索结果提示
            Row.justifyContent(FlexAlign.Center);
            // 搜索结果提示
            Row.backgroundColor(this.currentThemeColors.backgroundColor);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777269, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            Text.fontSize(SMALL_FONT_SIZE);
            Text.fontColor(this.currentThemeColors.secondaryTextColor);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.searchResults.toString());
            Text.fontSize(SMALL_FONT_SIZE);
            Text.fontColor(this.currentThemeColors.accentColor);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777270, "type": 10003, params: [], "bundleName": "com.example.list_harmony", "moduleName": "entry" });
            Text.fontSize(SMALL_FONT_SIZE);
            Text.fontColor(this.currentThemeColors.secondaryTextColor);
        }, Text);
        Text.pop();
        // 搜索结果提示
        Row.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 搜索结果列表
                    GoodsList(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 186, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "GoodsList" });
        }
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(LAYOUT_WIDTH_OR_HEIGHT);
            Column.height(LAYOUT_WIDTH_OR_HEIGHT);
            Column.backgroundColor(this.currentThemeColors.cardBackgroundColor);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部搜索栏
            Row.create();
            // 顶部搜索栏
            Row.width(LAYOUT_WIDTH_OR_HEIGHT);
            // 顶部搜索栏
            Row.height(NAV_BAR_HEIGHT);
            // 顶部搜索栏
            Row.padding({ left: 8, right: 8 });
            // 顶部搜索栏
            Row.backgroundColor(this.currentThemeColors.cardBackgroundColor);
        }, Row);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new SearchBar(this, {
                        searchText: this.__searchText,
                        onSearchClick: () => {
                            this.handleSearch();
                        },
                        onClearClick: () => {
                            this.handleClear();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/SearchPage.ets", line: 196, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            searchText: this.searchText,
                            onSearchClick: () => {
                                this.handleSearch();
                            },
                            onClearClick: () => {
                                this.handleClear();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "SearchBar" });
        }
        // 顶部搜索栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 内容区域
            if (this.isSearching) {
                this.ifElseBranchUpdateFunction(0, () => {
                    // 显示搜索结果
                    this.SearchResultBuilder.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 显示搜索历史和热门搜索
                        Scroll.create();
                        // 显示搜索历史和热门搜索
                        Scroll.width(LAYOUT_WIDTH_OR_HEIGHT);
                        // 显示搜索历史和热门搜索
                        Scroll.layoutWeight(1);
                        // 显示搜索历史和热门搜索
                        Scroll.backgroundColor(this.currentThemeColors.cardBackgroundColor);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(LAYOUT_WIDTH_OR_HEIGHT);
                    }, Column);
                    this.SearchHistoryBuilder.bind(this)();
                    this.HotSearchBuilder.bind(this)();
                    Column.pop();
                    // 显示搜索历史和热门搜索
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
