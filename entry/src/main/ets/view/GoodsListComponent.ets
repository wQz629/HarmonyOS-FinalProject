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
import router from '@ohos.router'; // 引入路由模块
import promptAction from '@ohos.promptAction';

@Component
export default struct GoodsList {
  @StorageLink('compareList') compareList: GoodsListItemType[] = [];
  @StorageLink('themeColors') currentThemeColors: ThemeColors = DEFAULT_THEME;
  @Provide goodsListData: ListDataSource = ListDataSource.getInstance();
  @Prop layoutMode: 'list' | 'grid' = 'list'; // 添加布局模式属性
  private startTouchOffsetY: number = 0;
  private endTouchOffsetY: number = 0;

  // 将商品数据按两列分组（用于网格布局）
  private groupItems(data: ListDataSource): GoodsListItemType[][] {
    let rows: GoodsListItemType[][] = [];
    for (let i = 0; i < data.totalCount(); i += 2) {
      let row: GoodsListItemType[] = [];
      let item1 = data.getData(i);
      if (item1) row.push(item1);
      if (i + 1 < data.totalCount()) {
        let item2 = data.getData(i + 1);
        if (item2) row.push(item2);
      }
      if (row.length > 0) rows.push(row);
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
    } else {
      // 如果不存在，判断是否超过限制 (比如最多2个)
      if (this.compareList.length >= 2) {
        try {
          promptAction.showToast({ message: '最多同时对比两个商品' });
        } catch (_) {
          // 处理异常
        }
        return;
      }
      // 加入对比
      this.compareList.push(item);
      try {
        promptAction.showToast({ message: '已加入对比' });
      } catch (_) {
        // 处理异常
      }
    }
  }

  @Builder
  GoodsItem(item: GoodsListItemType) {
    Column() {
      Image(item?.goodsImg)
        .width(140) // 网格布局中图片宽度调整为140
        .height(140) // 高度也调整为140
        .draggable(false)

      Text(item?.goodsName)
        .fontSize(commonConst.NORMAL_FONT_SIZE)
        .fontColor(this.currentThemeColors.primaryTextColor)
        .margin({ top: 8 })

      Text(item?.advertisingLanguage)
        .fontColor(this.currentThemeColors.primaryTextColor)
        .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
        .margin({ top: 4 })

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
    }
    .padding(8)
    .backgroundColor(this.currentThemeColors.cardBackgroundColor)
    .borderRadius(8)
    .width('48%') // 设置宽度为48%以适应两列布局
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
    if (this.layoutMode === 'list') {
      // 平铺布局（原有布局）
      Stack({ alignContent: Alignment.BottomEnd }) {
        Row() {
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

                      // 对比图标/按钮
                      Image(this.isInCompareList(item) ? $r('app.media.ic_compare_selected') : $r('app.media.ic_compare_unselected'))
                        .width(24)
                        .height(24)
                        .gesture(
                          TapGesture()
                            .onAction(() => {
                              this.handleCompare(item);
                            })
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
              .onTouch((event?: TouchEvent) => {
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
              })
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
          }
          .width(commonConst.GOODS_LIST_WIDTH)
          .divider({ strokeWidth: 1, color: this.currentThemeColors.dividerColor })
        }
        .justifyContent(FlexAlign.Center)
        .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)

        // 悬浮的进入对比页面按钮
        if (this.compareList.length > 0) {
          Button(`开始对比 (${this.compareList.length})`)
            .backgroundColor(this.currentThemeColors.accentColor)
            .fontColor('#FFFFFF')
            .margin({ bottom: 80, right: 20 })
            .onClick(() => {
              if (this.compareList.length < 2) {
                try {
                  promptAction.showToast({ message: '请至少选择两个商品进行对比' });
                } catch (_) {
                  // 处理异常
                }
                return;
              }
              router.pushUrl({ url: 'pages/ComparisonPage' });
            })
        }
      }
      .width('100%')
      .height('100%')
    } else {
      // 2列网格布局
      Column() {
        ForEach(this.groupItems(this.goodsListData), (row: GoodsListItemType[], index: number) => {
          Row({ space: 8 }) {
            this.GoodsItem(row[0])
            if (row.length > 1) {
              this.GoodsItem(row[1])
            } else {
              Blank()
            }
          }
          .padding({ left: 8, right: 8 })
        })
      }
      .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
    }
  }
}