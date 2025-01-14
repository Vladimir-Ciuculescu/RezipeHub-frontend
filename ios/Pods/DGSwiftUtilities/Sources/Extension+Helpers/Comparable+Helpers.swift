//
//  Comparable+Helpers.swift
//  
//
//  Created by Dominic Go on 7/10/24.
//

import Foundation


public extension Comparable {
  static func < <T: Comparable>(lhs: Self, rhs: T) -> Bool {
    guard let lhs = lhs as? T else {
      return false;
    };
    
    return lhs < rhs;
  };
  
  func isLessThan<T: Comparable>(to other: T) -> Bool {
    return self < other;
  };
  
  func isGreaterThan<T: Comparable>(to other: T) -> Bool {
    return other < self;
  };
};
