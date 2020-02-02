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

describe('LWC Document Linking', function() {
  let lwcDir: string;

  before(async function() {
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
      path.join(lwcDir, 'hello', 'hello.html')
    );
    const editor = await window.showTextDocument(doc);

    // select the 'c-view-source' tag
    const position = new Position(6, 16);

    const locations = (await commands.executeCommand(
      'vscode.executeDefinitionProvider',
      editor.document.uri,
      position
    )) as Location[];

    expect(locations).to.have.lengthOf(1);

    const location = locations![0];

    expect(location).to.have.property('uri');

    const expectedURI = URI.file(
      path.join(lwcDir, 'viewSource', 'viewSource.js')
    );

    expect(location.uri.toString()).to.equal(expectedURI.toString());
  });
});
