//
//  Array+Helpers.swift
//  
//
//  Created by Dominic Go on 6/16/24.
//

import Foundation

public typealias IndexValuePair<T> = (index: Int, value: T);

public extension Array {

  /// Kind of like a type-erased version of `Enumerated`
  typealias IndexElementPair = IndexValuePair<Element>;

  subscript(cyclicIndex index: Index) -> Element {
    get {
      self[self.index(forCyclicIndex: index)];
    }
    set {
      self[self.index(forCyclicIndex: index)] = newValue;
    }
  }
  
  func index(forCyclicIndex cyclicIndex: Index) -> Index {
    return cyclicIndex % self.count;
  };
  
  func first<T>(whereType type: T.Type) -> T? {
    let match = self.first {
      $0 is T;
    };
    
    return match as? T;
  };
  
  func extractValues<U>(
    forKey key: KeyPath<Element, U>
  ) -> [U] {
    self.map {
      $0[keyPath: key];
    };
  };

  func indexedFirst(
    where predicate: (_ index: Index, _ value: Element) -> Bool
  ) -> IndexElementPair? {
    let match = self.enumerated().first {
      predicate($0.offset, $0.element);
    };
    
    guard let match = match else {
      return nil;
    };
    
    return (match.offset, match.element);
  };
  
  mutating func unwrapThenAppend(_ element: Element?) {
    guard let element = element else { return };
    self.append(element);
  };
};
