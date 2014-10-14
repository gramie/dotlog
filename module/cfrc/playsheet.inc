<div id="playsheet-edit-dialog" style="border: 1px dotted gray;">
    <table>
        <tbody>
            <tr>
                <th>Time</th>
                <td class="playsheet-time">
                <table>
                <tr id='edit-playsheet-item-time'>
                <td rowspan="2">
                    From<span class="required">*</span> <input type="text" class="from-time" /> 
                    to 
                </td>
                <td>
                    <input type="radio" name="end-time" id="dialog-to-time" checked="checked" class="time-radio" />
                    <input type="text" class="to-time" /><br />
                    <input type="radio" name="end-time" id="dialog-duration" class="time-radio" />
                    <input type="text" class="duration" disabled="disabled" /> minutes
                </td>
                </tr>
                </table>
                    </td>
            </tr>
            <tr>
                <th>Song<span class="required">*</span></th>
                <td><input type="text" class="song" /></td>
            </tr>
            <tr>
                <th>Artist</th>
                <td><input type="text" class="artist" /></td>
            </tr>
            <tr>
                <th>Categories</th>
                <td>
                    <label><input type="checkbox" class="newsong" value="1" /> New</label>
                    <label><input type="checkbox" class="cancon" value="1" /> CanCon</label>
                    <label><input type="checkbox" class="instrumental" value="1" /> Instrumental</label>
                    <label><input type="checkbox" class="hit" value="1" /> Hit</label>
                </td>
            </tr>
            <tr>
                <th>CRTC<span class="required">*</span></th>
                <td>
                    <select class="crtc">
                        <option value=""></option>
                    </select>
                </td>
            </tr>
            <tr>
                <th>Language<span class="required">*</span></th>
                <td><input type="text" class="language" /></td>
            </tr>
            
        </tbody>
    </table>
</div>
