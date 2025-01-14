//
//  UITraitEnvironmentLayoutDirection+CaseIterable.swift
//
//
//  Created by Dominic Go on 12/18/23.
//

import UIKit

extension UITraitEnvironmentLayoutDirection: CaseIterable {

  public static var allCases: [Self] = [
    .unspecified,
    .leftToRight,
    .rightToLeft,
  ];
};
