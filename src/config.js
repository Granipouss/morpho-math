export default {
  matrixLength: 5,
  actionList: [
    { type: 'copy', label: 'Copy' },
    { type: 'inverse', label: 'Inverse' },
    { type: 'add', label: 'Addition' },
    { type: 'sub', label: 'Substraction' },
    { type: 'sup', label: 'Max' },
    { type: 'inf', label: 'Min' },
    { type: 'xor', label: 'XOR' },
    { type: 'threshold', label: 'Threshold' },
    { type: 'diff', label: 'Difference' },
    { type: 'dilation', label: 'Dilation' },
    { type: 'erosion', label: 'Erosion' },
    { type: 'reconstruct', label: 'Reconstruct' }
  ],
  script: {
    nbVars: 5,
    guide: `
      Here, you can execute JS scripts to modify your images. You have access to
      all the javascript standard syntax (if, for, etc.) but also some specific
      variables and functions.<br>
      <br>
      All your snapshots are referenced in the <i>'img'</i> array. <i>'img[0]'</i>
      is the original image, <i>'img[n]'</i> is the n-th snapshot. Those are bytes
      arrays of the 8bit unsigned integers that you can read and modify (except
      for the original one that will stay unchanged). You can know which one are
      selected thanks to the index array, <i>'index[0]'</i> is the number of the
      selected snapshot and <i>'index[1]'</i> the number of the secondary selected
      snapshot.<br> You can access all settings through various variables
      (<i>'structElement'</i>, <i>'connexity'</i>, <i>'wrapMode'</i>, <i>'param'</i>,
      <i>'height'</i>, <i>'width'</i>).<br>
      <br>
      You also can use many functions to modify the data. Read the documentations
      for more info.
    `
  }
}
