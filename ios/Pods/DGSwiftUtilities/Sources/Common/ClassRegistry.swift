//
//  ClassRegistry.swift
//  ReactNativeIosUtilities
//
//  Created by Dominic Go on 2/15/24.
//

import Foundation


public final class ClassRegistry {

  public typealias CompletionHandler = (
    _ sender: ClassRegistry,
    _ allClasses:  [AnyClass]
  ) -> Void;
  
  public static var shared: ClassRegistry = .init();
  
  // MARK: - Private Properties
  // --------------------------
  
  private var _completionBlockQueue: [CompletionHandler] = [];
  
  #if DEBUG
  public var _debugTimesLoaded: Int = 0;
  #endif
  
  // MARK: - Public Properties
  // -------------------------
  
  public var allClassesCached: [AnyClass]?;
  
  public var loadingState: LoadingState = .notLoaded;
  
  // MARK: -
  // -------
  
  private init(){
    // no-op
  };
  
  private func _notifyForCompletion(allClasses: [AnyClass]) {
    for completionBlock in self._completionBlockQueue {
      completionBlock(self, allClasses);
    };
    
    self._completionBlockQueue = [];
  };
  
  public func loadClasses(completion completionBlock: CompletionHandler?){
    if let completionBlock = completionBlock {
      self._completionBlockQueue.append(completionBlock);
    };
  
    if let allClasses = self.allClassesCached,
       self.loadingState.isLoaded
    {
      self._notifyForCompletion(allClasses: allClasses);
      return;
    };
    
    guard self.loadingState.shouldLoad else { return };
    self.allClassesCached = nil;
    self.loadingState = .loading;
    
    DispatchQueue.global(qos: .background).async {
      let classes = Self.getAllClassesSync();
      
      self.allClassesCached = classes;
      self.loadingState = .loaded;
      
      #if DEBUG
      self._debugTimesLoaded += 1;
      #endif
      
      DispatchQueue.main.async {
        self._notifyForCompletion(allClasses: classes);
      }
    };
  };
  
  public func clearCache(){
    self.allClassesCached = nil;
    self.loadingState = .notLoaded;
  };
  
  public func reloadClasses(completion completionBlock: CompletionHandler?){
    self.clearCache();
    self.loadClasses(completion: completionBlock);
  };
};

// MARK: - ClassRegistry+StaticMethods
// -----------------------------------

public extension ClassRegistry {

  static func getAllClassesSync() -> [AnyClass] {
    let numberOfClasses = Int(objc_getClassList(nil, 0));
    guard numberOfClasses > 0 else { return [] };

    let classesPtr =
      UnsafeMutablePointer<AnyClass>.allocate(capacity: numberOfClasses);
      
    let autoreleasingClasses =
      AutoreleasingUnsafeMutablePointer<AnyClass>(classesPtr);

    let count = objc_getClassList(autoreleasingClasses, Int32(numberOfClasses));
    assert(count > 0);

    defer {
      classesPtr.deallocate();
    };

    var classes: [AnyClass] = [];

    for index in 0 ..< numberOfClasses {
      classes.append(classesPtr[index]);
    };

    return classes;
  };
};
