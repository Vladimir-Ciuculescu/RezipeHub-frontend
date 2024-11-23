//
//  UIContextMenuInteractionCommitStyle+CaseIterable.swift
//
//
//  Created by Dominic Go on 12/18/23.
//

import UIKit

@available(iOS 13.0, *)
extension UIContextMenuInteractionCommitStyle: CaseIterable {

  public static var allCases: [Self] = [
    .dismiss,
    .pop,
  ];
};

