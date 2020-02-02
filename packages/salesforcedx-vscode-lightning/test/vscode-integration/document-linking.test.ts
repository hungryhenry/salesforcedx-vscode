/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as path from 'path';
import { Location, Position, commands, window, workspace } from 'vscode';
import URI from 'vscode-uri';

describe('Aura Document Linking', function() {
  let auraDir: string;
  let lwcDir: string;

  before(async function() {
    auraDir = path.join(
      workspace.workspaceFolders![0].uri.fsPath,
      'force-app',
      'main',
      'default',
      'aura'
    );

    lwcDir = path.join(
      workspace.workspaceFolders![0].uri.fsPath,
      'force-app',
      'main',
      'default',
      'lwc'
    );

    await new Promise(r => setTimeout(r, 1500));
  });

  it('Should provide navigation to a selected LWC tag', async function() {
    const doc = await workspace.openTextDocument(
      path.join(auraDir, 'auraEmbeddedLWC', 'auraEmbeddedLWC.cmp')
    );
    const editor = await window.showTextDocument(doc);

    // select the 'c:contactList' LWC tag
    const position = new Position(20, 28);

    const locations = (await commands.executeCommand(
      'vscode.executeDefinitionProvider',
      editor.document.uri,
      position
    )) as Location[];

    expect(locations).to.have.lengthOf(1);

    const location = locations![0];

    expect(location).to.have.property('uri');

    const expectedURI = URI.file(
      path.join(lwcDir, 'contactList', 'contactList.js')
    );

    expect(location.uri.toString()).to.equal(expectedURI.toString());
  });
});
