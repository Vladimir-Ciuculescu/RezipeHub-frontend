//
//  UIModalPresentationStyle+CaseIterable.swift
//  
//
//  Created by Dominic Go on 6/17/24.
//
import UIKit

extension UIModalPresentationStyle: CaseIterable {
  public static var allCases: [UIModalPresentationStyle] {
    var items: [UIModalPresentationStyle] = [
      .fullScreen,
      .pageSheet,
      .formSheet,
      .currentContext,
      .custom,
      .overFullScreen,
      .overCurrentContext,
      .popover,
      .none,
    ];
    
    if #available(iOS 13.0, *) {
      items.append(.automatic);
    };
    
    return items;
  }
};
