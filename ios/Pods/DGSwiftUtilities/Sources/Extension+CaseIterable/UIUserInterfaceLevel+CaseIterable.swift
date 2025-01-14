//
//  UIUserInterfaceLevel+CaseIterable.swift
//
//
//  Created by Dominic Go on 12/17/23.
//

import UIKit

@available(iOS 13.0, *)
extension UIUserInterfaceLevel: CaseIterable {

  public static var allCases: [Self] = [
    .unspecified,
    .base,
    .elevated,
  ];
};
