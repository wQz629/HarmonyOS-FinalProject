import SearchBar from '../view/SearchBarComponent';
import GoodsList from '../view/GoodsListComponent';
import {
  LAYOUT_WIDTH_OR_HEIGHT,
  NORMAL_FONT_SIZE,
  SMALL_FONT_SIZE,
  NAV_BAR_HEIGHT
} from '../common/CommonConstants';
import { ThemeColors, DEFAULT_THEME } from '../common/Colors';

@Component
export default struct SearchPage {
  @State @Watch('onSearchTextChanged') searchText: string = '';
  @State isSearching: boolean = false;
  @State showSuggestions: boolean = false;
  @State searchHistory: string[] = ['手机', '笔记本', '耳机', '键盘'];
  @State hotSearchList: string[] = ['华为手机', '苹果手机', '小米手机', '蓝牙耳机', '机械键盘'];
  @State suggestions: string[] = [];
  @State searchResults: number = 0;

  // --- 新增状态：专门用于处理“手机”搜索 ---
  @State isPhoneSpecialCase: boolean = false;
  @State phoneImages: Resource[] = [
    $r('app.media.phone_1'), $r('app.media.phone_2'), $r('app.media.phone_3'), $r('app.media.phone_4'), $r('app.media.phone_5'),
    $r('app.media.phone_6'), $r('app.media.phone_7'), $r('app.media.phone_8'), $r('app.media.phone_9'), $r('app.media.phone_10'),
    $r('app.media.phone_11'), $r('app.media.phone_12'), $r('app.media.phone_13'), $r('app.media.phone_14'), $r('app.media.phone_15'),
    $r('app.media.phone_16'), $r('app.media.phone_17'), $r('app.media.phone_18'), $r('app.media.phone_19'), $r('app.media.phone_20'),
    $r('app.media.phone_21'), $r('app.media.phone_22'), $r('app.media.phone_23'), $r('app.media.phone_24'), $r('app.media.phone_25')
  ];

  @StorageLink('themeColors') currentThemeColors: ThemeColors = DEFAULT_THEME;

  private suggestionLibrary: string[] = [
    '华为 Mate 60', '华为 P60', '华为 平板', '华为 FreeBuds',
    '苹果 iPhone 15', '苹果 MacBook Pro', '小米 14 Ultra',
    '机械键盘 蓝牙双模', '入耳式耳机', '无线鼠标'
  ];

  onSearchTextChanged() {
    const query = this.searchText.trim();
    if (query.length > 0) {
      this.suggestions = this.suggestionLibrary.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
      );
      this.isSearching = false;
      this.showSuggestions = true;
    } else {
      this.showSuggestions = false;
      this.suggestions = [];
      this.isSearching = false;
    }
  }

  handleSearch(fixedText?: string) {
    let target = (fixedText !== undefined) ? fixedText : this.searchText;
    const query = target.trim();

    if (query.length === 0) return;

    this.searchText = query;

    // --- 新增逻辑：判断是否为特定词汇“手机” ---
    if (query === '手机') {
      this.isPhoneSpecialCase = true;
      this.searchResults = 25; // 固定显示25个结果
    } else {
      this.isPhoneSpecialCase = false;
      // 原始模拟统计逻辑
      const matched = this.suggestionLibrary.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
      );
      this.searchResults = matched.length;
    }

    // 历史记录逻辑
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      if (this.searchHistory.length > 10) this.searchHistory.pop();
    }

    this.isSearching = true;
    this.showSuggestions = false;
  }

  handleClear() {
    this.searchText = '';
    this.isSearching = false;
    this.showSuggestions = false;
    this.suggestions = [];
    this.searchResults = 0;
    this.isPhoneSpecialCase = false; // 重置特殊状态
  }

  deleteHistoryItem(index: number) {
    this.searchHistory.splice(index, 1);
  }

  @Builder
  SuggestionListBuilder() {
    List() {
      ForEach(this.suggestions, (item: string) => {
        ListItem() {
          Row() {
            Image($r('app.media.ic_search_gray'))
              .width(18).height(18).margin({ right: 12 })
              .fillColor(this.currentThemeColors.secondaryTextColor)

            Text() {
              if (item.toLowerCase().includes(this.searchText.toLowerCase())) {
                Span(item.substring(0, item.toLowerCase().indexOf(this.searchText.toLowerCase())))
                Span(item.substring(
                  item.toLowerCase().indexOf(this.searchText.toLowerCase()),
                  item.toLowerCase().indexOf(this.searchText.toLowerCase()) + this.searchText.length
                ))
                  .fontColor(this.currentThemeColors.accentColor)
                  .fontWeight(FontWeight.Bold)
                Span(item.substring(item.toLowerCase().indexOf(this.searchText.toLowerCase()) + this.searchText.length))
              } else {
                Span(item)
              }
            }
            .fontSize(NORMAL_FONT_SIZE)
            .fontColor(this.currentThemeColors.primaryTextColor)
            .layoutWeight(1)

            Image($r('app.media.ic_arrow_left_top'))
              .width(14).height(14).opacity(0.3)
          }
          .width(LAYOUT_WIDTH_OR_HEIGHT)
          .height(52)
          .padding({ left: 16, right: 16 })
          .onClick(() => {
            this.handleSearch(item);
          })
        }
      }, (item: string) => item)
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .backgroundColor(this.currentThemeColors.backgroundColor)
    .divider({ strokeWidth: 0.5, color: this.currentThemeColors.dividerColor, startMargin: 46 })
  }

  @Builder
  SearchHistoryBuilder() {
    Column() {
      Row() {
        Text($r('app.string.search_history'))
          .fontSize(NORMAL_FONT_SIZE).fontWeight(FontWeight.Bold)
          .fontColor(this.currentThemeColors.primaryTextColor).layoutWeight(1)

        Text($r('app.string.clear_history'))
          .fontSize(SMALL_FONT_SIZE).fontColor(this.currentThemeColors.secondaryTextColor)
          .onClick(() => { this.searchHistory = []; })
      }
      .width(LAYOUT_WIDTH_OR_HEIGHT)
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })

      if (this.searchHistory.length > 0) {
        List() {
          ForEach(this.searchHistory, (item: string, index: number) => {
            ListItem() {
              Row() {
                Image($r('app.media.ic_history')).width(20).height(20)

                Text(item)
                  .fontSize(NORMAL_FONT_SIZE).fontColor(this.currentThemeColors.primaryTextColor)
                  .margin({ left: 12 }).layoutWeight(1)

                Row() {
                  Image($r('app.media.ic_search_cancel'))
                    .width(20).height(20)
                    .fillColor(this.currentThemeColors.secondaryTextColor)
                    .opacity(0.5)
                }
                .padding(8)
                .hitTestBehavior(HitTestMode.Block)
                .onClick(() => {
                  this.deleteHistoryItem(index);
                })
              }
              .width(LAYOUT_WIDTH_OR_HEIGHT)
              .height(48)
              .padding({ left: 16, right: 16 })
              .onClick(() => {
                this.handleSearch(item);
              })
            }
          }, (item: string, index: number) => item + index)
        }
        .divider({ strokeWidth: 1, color: this.currentThemeColors.dividerColor })
      }
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .backgroundColor(this.currentThemeColors.backgroundColor).margin({ top: 8 })
  }

  @Builder
  HotSearchBuilder() {
    Column() {
      Text($r('app.string.hot_search'))
        .fontSize(NORMAL_FONT_SIZE).fontWeight(FontWeight.Bold)
        .fontColor(this.currentThemeColors.primaryTextColor)
        .width(LAYOUT_WIDTH_OR_HEIGHT).padding({ left: 16, right: 16, top: 12, bottom: 12 })

      Flex({ wrap: FlexWrap.Wrap }) {
        ForEach(this.hotSearchList, (item: string) => {
          Text(item)
            .fontSize(SMALL_FONT_SIZE).fontColor(this.currentThemeColors.secondaryTextColor)
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .backgroundColor(this.currentThemeColors.backgroundColor)
            .borderRadius(16).margin({ right: 8, bottom: 8 })
            .onClick(() => { this.handleSearch(item); })
        }, (item: string) => item)
      }
      .width(LAYOUT_WIDTH_OR_HEIGHT).padding({ left: 16, right: 16, bottom: 16 })
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .backgroundColor(this.currentThemeColors.cardBackgroundColor).margin({ top: 8 })
  }

  // --- 新增：专门展示手机图片的网格组件 ---
  @Builder
  PhoneSpecialGrid() {
    Grid() {
      ForEach(this.phoneImages, (img: Resource, index: number) => {
        GridItem() {
          Column() {
            Image(img)
              .width('90%')
              .aspectRatio(1)
              .objectFit(ImageFit.Contain)
              .borderRadius(8)
              .backgroundColor('#F5F5F5')
            Text(`手机款型 ${index + 1}`)
              .fontSize(12)
              .margin({ top: 4 })
              .fontColor(this.currentThemeColors.primaryTextColor)
          }
          .padding(8)
        }
      }, (img: Resource) => JSON.stringify(img))
    }
    .columnsTemplate('1fr 1fr') // 两列展示
    .rowsGap(8)
    .columnsGap(8)
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .layoutWeight(1)
    .padding({ left: 8, right: 8 })
  }

  @Builder
  SearchResultBuilder() {
    Column() {
      Row() {
        Text($r('app.string.search_result_prefix'))
          .fontSize(SMALL_FONT_SIZE).fontColor(this.currentThemeColors.secondaryTextColor)
        Text(this.searchResults.toString())
          .fontSize(SMALL_FONT_SIZE).fontColor(this.currentThemeColors.accentColor)
          .fontWeight(FontWeight.Bold).margin({ left: 4, right: 4 })
        Text($r('app.string.search_result_suffix'))
          .fontSize(SMALL_FONT_SIZE).fontColor(this.currentThemeColors.secondaryTextColor)
      }
      .width(LAYOUT_WIDTH_OR_HEIGHT).height(NAV_BAR_HEIGHT)
      .justifyContent(FlexAlign.Center)
      .backgroundColor(this.currentThemeColors.backgroundColor)

      // --- 修改逻辑：如果是手机特殊案例展示网格，否则展示原始 GoodsList ---
      if (this.isPhoneSpecialCase) {
        this.PhoneSpecialGrid()
      } else {
        GoodsList()
      }
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT).layoutWeight(1)
  }

  build() {
    Column() {
      Row() {
        SearchBar({
          searchText: $searchText,
          onSearchClick: () => {
            this.handleSearch();
          },
          onClearClick: () => {
            this.handleClear();
          }
        })
      }
      .width(LAYOUT_WIDTH_OR_HEIGHT).height(NAV_BAR_HEIGHT)
      .padding({ left: 8, right: 8 })
      .backgroundColor(this.currentThemeColors.cardBackgroundColor)

      if (this.isSearching) {
        this.SearchResultBuilder()
      } else if (this.showSuggestions && this.suggestions.length > 0) {
        this.SuggestionListBuilder()
      } else {
        Scroll() {
          Column() {
            this.SearchHistoryBuilder()
            this.HotSearchBuilder()
          }
          .width(LAYOUT_WIDTH_OR_HEIGHT)
        }
        .width(LAYOUT_WIDTH_OR_HEIGHT).layoutWeight(1)
        .backgroundColor(this.currentThemeColors.cardBackgroundColor)
      }
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT).height('100%')
    .backgroundColor(this.currentThemeColors.cardBackgroundColor)
  }
}