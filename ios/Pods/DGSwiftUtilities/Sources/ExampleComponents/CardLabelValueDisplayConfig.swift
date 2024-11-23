//
//  CardLabelValueDisplayConfig.swift
//  ConfigBasedModalExample
//
//  Created by Dominic Go on 6/15/24.
//

import UIKit


public struct CardLabelValueDisplayConfig {
  
  public var items: [CardLabelValueDisplayItemConfig];
  public var colorThemeConfig: ColorThemeConfig;
  
  public init(
    items: [CardLabelValueDisplayItemConfig],
    colorThemeConfig: ColorThemeConfig
  ) {
    self.items = items;
    self.colorThemeConfig = colorThemeConfig;
  };
  
  public init(
    items: [CardLabelValueDisplayItemConfig],
    deriveColorThemeConfigFrom colorThemeConfig: ColorThemeConfig
  ) {
    self.items = items;
    var colorThemeConfig = colorThemeConfig;
    
    colorThemeConfig.colorBgLight =
      colorThemeConfig.colorBgDark.withAlphaComponent(0.15);
      
    colorThemeConfig.colorBgDark =
      colorThemeConfig.colorBgDark.withAlphaComponent(0.7);

    self.colorThemeConfig = colorThemeConfig;
  };
  
  public func createView() -> UIView {
    let rootVStack = {
      let stack = UIStackView();
      
      stack.axis = .vertical;
      stack.distribution = .fill;
      stack.alignment = .fill;
      
      stack.backgroundColor = self.colorThemeConfig.colorBgLight;
      
      stack.clipsToBounds = true;
      stack.layer.cornerRadius = 8;
      stack.layer.maskedCorners = .allCorners;
      
      stack.isLayoutMarginsRelativeArrangement = true;
      stack.layoutMargins = UIEdgeInsets(
        top: 8,
        left: 8,
        bottom: 8,
        right: 8
      );
                
      return stack;
    }();
    
    for itemConfig in self.items {
      let itemView =
        itemConfig.createView(colorThemeConfig: self.colorThemeConfig);
        
      rootVStack.addArrangedSubview(itemView);
    };
    
    return rootVStack;
  };
};
