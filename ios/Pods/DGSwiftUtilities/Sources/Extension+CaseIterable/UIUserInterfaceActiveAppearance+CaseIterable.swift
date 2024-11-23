//
//  UIUserInterfaceActiveAppearance+CaseIterable.swift
//
//
//  Created by Dominic Go on 12/18/23.
//

import UIKit

@available(iOS 14.0, *)
extension UIUserInterfaceActiveAppearance: CaseIterable {

  public static var allCases: [Self] = [
    .unspecified,
    .inactive,
    .active,
  ];
};
