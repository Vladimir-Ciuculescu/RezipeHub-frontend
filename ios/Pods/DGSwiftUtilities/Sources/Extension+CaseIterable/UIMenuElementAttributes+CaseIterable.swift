//
//  UIMenuElementAttributes+CaseIterable.swift
//
//
//  Created by Dominic Go on 12/18/23.
//

import UIKit

@available(iOS 13.0, *)
extension UIMenuElement.Attributes: CaseIterable {

  public static var allCases: [Self] {
    var cases: [Self] = [];
    
    #if !targetEnvironment(macCatalyst)
    #if swift(>=5.7)
    if #available(iOS 16.0, *) {
      cases.append(.keepsMenuPresented);
    };
    #endif
    #endif
    
    return cases;
  };
};
