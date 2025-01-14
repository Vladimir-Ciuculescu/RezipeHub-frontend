//
//  UIUserInterfaceIdiom+CaseIterable.swift
//  
//
//  Created by Dominic Go on 12/17/23.
//

import UIKit

extension UIUserInterfaceIdiom: CaseIterable {

  public static var allCases: [Self] {
    var cases: [Self] = [
      .unspecified,
    ];
    
    if #available(iOS 3.2, *) {
      cases.append(.phone);
      cases.append(.pad);
    };

    
    if #available(iOS 9.0, *) {
      cases.append(.tv);
      cases.append(.carPlay);
    };
    
    if #available(iOS 14.0, *) {
      cases.append(.mac);
    };
    
    return cases;
  };
};

