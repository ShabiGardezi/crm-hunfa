import { FormControl, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { BusinessStatustValues } from 'src/shared/enums/BusinessStatus.enum'
import UpdateBusinessDialog from '../../dialogs/UpdateBusinessDialog'
import ViewBusinessDialog from '../../dialogs/ViewBusinessDialog'

function BusinessesColumns(updateStatus: any) {
  return [
    {
      header: 'Name',
      accessorKey: 'business_name'
    },
    {
      header: 'Email',
      accessorKey: 'business_email'
    },
    {
      header: 'Number',
      accessorKey: 'business_number'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      filterVariant: 'select',
      filterSelectOptions: BusinessStatustValues,
      Cell: ({ cell }: any) => {
        const { _id } = cell.row.original
        const defaultValue = cell.getValue() ? cell.getValue() : ''
        const [value, setValue] = useState(defaultValue)

        return (
          <>
            <FormControl>
              <Select
                size='small'
                sx={{ fontSize: '14px' }}
                onChange={(e: any) => {
                  setValue(e.target.value)
                  updateStatus(_id, e.target.value)
                }}
                value={value}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {BusinessStatustValues.map((e: any) => {
                  return (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </>
        )
      }
    },
    {
      header: 'Action',
      Cell: ({ cell }: any) => {
        const { _id } = cell.row.original

        return (
          <>
            <ViewBusinessDialog id={_id} />
            {<UpdateBusinessDialog id={_id} />}
          </>
        )
      }
    }
  ]
}

export default BusinessesColumns
