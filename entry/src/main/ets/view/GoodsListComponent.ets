/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License,Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as commonConst from '../common/CommonConstants';
import { GoodsListItemType } from '../viewmodel/InitialData';
import { ListDataSource } from '../viewmodel/ListDataSource';
import { ThemeColors, DEFAULT_THEME } from '../common/Colors';
import router from '@ohos.router';
import promptAction from '@ohos.promptAction';

@Component
export default struct GoodsList {
  @StorageLink('compareList') compareList: GoodsListItemType[] = [];
  @StorageLink('themeColors') currentThemeColors: ThemeColors = DEFAULT_THEME;
  @Provide goodsListData: ListDataSource = ListDataSource.getInstance();
  @Prop layoutMode: 'list' | 'grid' = 'list';

  // 【新增】控制加载状态
  @State isLoading: boolean = false;
  // 【新增】定义动画播放一轮的最短时间 (毫秒)，根据你的 GIF 实际时长调整
  private readonly ANIMATION_DURATION = 1500;

  // 判断商品是否已在对比列表中
  isInCompareList(item: GoodsListItemType): boolean {
    return this.compareList.some(compareItem => compareItem.id === item.id);
  }

  // 处理对比点击
  handleCompare(item: GoodsListItemType) {
    if (this.isInCompareList(item)) {
      this.compareList = this.compareList.filter(compareItem => compareItem.id !== item.id);
    } else {
      if (this.compareList.length >= 2) {
        try {
          promptAction.showToast({ message: '最多同时对比两个商品' });
        } catch (_) {}
        return;
      }
      this.compareList.push(item);
      try {
        promptAction.showToast({ message: '已加入对比' });
      } catch (_) {}
    }
  }

  /**
   * 【核心逻辑修改】加载更多数据
   * 同时满足：1.数据加载完成 2.动画至少播放完一轮
   */
  async loadMore() {
    // 防止重复触发
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    const startTime = Date.now();

    // 任务1: 最小动画时长的 Promise
    const animationTask = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, this.ANIMATION_DURATION);
    });

    // 任务2: 数据加载的 Promise
    // 注意：目前的 loadNextPage 是同步的，为了演示效果我们把它包装一下。
    // 如果以后 goodsListData 变成网络请求，这里天然就是异步的。
    const dataTask = new Promise<void>((resolve) => {
      // 这里可以模拟网络延迟，例如 setTimeout 500ms
      // 实际上这里是立即执行
      resolve();
    });

    // 等待 动画 和 数据准备 两个都完成
    await Promise.all([animationTask, dataTask]);

    // 只有当两者都结束后，才真正往列表中塞入数据（刷新界面）并关闭 Loading
    this.goodsListData.loadNextPage();
    this.isLoading = false;
  }

  // 【新增】底部加载指示器组件
  @Builder
  LoadingIndicator() {
    Row() {
      Image($r('app.media.refreshing')) // 使用你指定的 GIF
        .width(30)
        .height(30)
        .margin({ right: 10 })

      Text('加载中...')
        .fontSize(14)
        .fontColor(this.currentThemeColors.secondaryTextColor || '#999999')
    }
    .width('100%')
    .height(50)
    .justifyContent(FlexAlign.Center)
    .backgroundColor(Color.Transparent)
  }

  @Builder
  GoodsItem(item: GoodsListItemType) {
    Column() {
      Image(item?.goodsImg)
        .width(140)
        .height(140)
        .draggable(false)

      Text(item?.goodsName)
        .fontSize(commonConst.NORMAL_FONT_SIZE)
        .fontColor(this.currentThemeColors.primaryTextColor)
        .margin({ top: 8 })
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      Text(item?.advertisingLanguage)
        .fontColor(this.currentThemeColors.primaryTextColor)
        .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
        .margin({ top: 4 })
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      Row() {
        Text(item?.evaluate)
          .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
          .fontColor(this.currentThemeColors.accentColor)
        Text(item?.price)
          .fontSize(commonConst.NORMAL_FONT_SIZE)
          .fontColor(this.currentThemeColors.accentColor)
      }
      .justifyContent(FlexAlign.SpaceBetween)
      .margin({ top: 4 })
      .width('100%')
    }
    .padding(8)
    .backgroundColor(this.currentThemeColors.cardBackgroundColor)
    .borderRadius(8)
    .width('100%')
    .onClick(() => {
      router.pushUrl({
        url: 'pages/GoodsDetailPage',
        params: {
          goodsId: item.id,
          goodsName: item.goodsName,
          goodsPrice: item.price,
          goodsImg: item.goodsImg
        }
      });
    })
  }

  build() {
    Stack({ alignContent: Alignment.BottomEnd }) {
      if (this.layoutMode === 'list') {
        // ================== 列表布局 (List) ==================
        Column() {
          List({ space: commonConst.LIST_ITEM_SPACE }) {
            LazyForEach(this.goodsListData, (item: GoodsListItemType) => {
              ListItem() {
                Row() {
                  Column() {
                    Image(item?.goodsImg)
                      .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
                      .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
                      .draggable(false)
                  }
                  .width(commonConst.GOODS_IMAGE_WIDTH)
                  .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)

                  Column() {
                    Text(item?.goodsName)
                      .fontSize(commonConst.NORMAL_FONT_SIZE)
                      .fontColor(this.currentThemeColors.primaryTextColor)

                    Text(item?.advertisingLanguage)
                      .fontColor(this.currentThemeColors.primaryTextColor)
                      .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
                      .margin({ right: commonConst.MARGIN_RIGHT })

                    Row() {
                      // 价格和评价
                      Column() {
                        Text(item?.evaluate)
                          .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
                          .fontColor(this.currentThemeColors.accentColor)
                        Text(item?.price)
                          .fontSize(commonConst.NORMAL_FONT_SIZE)
                          .fontColor(this.currentThemeColors.accentColor)
                      }
                      .alignItems(HorizontalAlign.Start)

                      // 对比图标
                      Image(this.isInCompareList(item) ? $r('app.media.ic_compare_selected') : $r('app.media.ic_compare_unselected'))
                        .width(24)
                        .height(24)
                        .gesture(
                          TapGesture().onAction(() => { this.handleCompare(item); })
                        )
                    }
                    .justifyContent(FlexAlign.SpaceBetween)
                    .width('100%')
                  }
                  .padding(commonConst.GOODS_LIST_PADDING)
                  .width(commonConst.GOODS_FONT_WIDTH)
                  .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
                  .justifyContent(FlexAlign.SpaceBetween)
                }
                .justifyContent(FlexAlign.SpaceBetween)
                .height(commonConst.GOODS_LIST_HEIGHT)
                .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
              }
              .onClick(() => {
                router.pushUrl({
                  url: 'pages/GoodsDetailPage',
                  params: {
                    goodsId: item.id,
                    goodsName: item.goodsName,
                    goodsPrice: item.price,
                    goodsImg: item.goodsImg
                  }
                })
              })
            })

            // 【List 特有】在列表末尾添加加载条 ListItem
            if (this.isLoading) {
              ListItem() {
                this.LoadingIndicator()
              }
            }
          }
          .width(commonConst.GOODS_LIST_WIDTH)
          .divider({ strokeWidth: 1, color: this.currentThemeColors.dividerColor })
          .onReachEnd(() => {
            // 触发自定义的带动画逻辑的加载方法
            this.loadMore();
          })
        }
        .justifyContent(FlexAlign.Start)
        .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
        .height('100%')

      } else {
        // ================== 网格布局 (Grid) ==================
        Column() {
          Grid() {
            LazyForEach(this.goodsListData, (item: GoodsListItemType) => {
              GridItem() {
                this.GoodsItem(item)
              }
            })
          }
          .columnsTemplate('1fr 1fr')
          .columnsGap(8)
          .rowsGap(8)
          .padding({ left: 8, right: 8, bottom: 8 })
          .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
          .layoutWeight(1) // 让 Grid 占据剩余空间
          .onReachEnd(() => {
            // 触发自定义的带动画逻辑的加载方法
            this.loadMore();
          })

          // 【Grid 特有】由于 GridItem 难以做跨列 Footer，我们在 Grid 下方显示加载条
          if (this.isLoading) {
            this.LoadingIndicator()
          }
        }
        .width('100%')
        .height('100%')
      }

      // ================== 悬浮对比按钮 ==================
      if (this.compareList.length > 0) {
        Button(`开始对比 (${this.compareList.length})`)
          .backgroundColor(this.currentThemeColors.accentColor)
          .fontColor('#FFFFFF')
          .margin({ bottom: 80, right: 20 })
          .onClick(() => {
            if (this.compareList.length < 2) {
              try {
                promptAction.showToast({ message: '请至少选择两个商品进行对比' });
              } catch (_) {}
              return;
            }
            router.pushUrl({ url: 'pages/ComparisonPage' });
          })
      }
    }
    .width('100%')
    .height('100%')
  }
}
