#
# Sample script to read the status from the server and print on stdout
# Heiko W. Rupp
#

require 'rest_client'
require 'JSON'

server = 'localhost'
port='7080'
user = 'rhqadmin'
password = 'rhqadmin'
rest_base = '/rest/1'

base_url = 'http://' + user+ ':' + password +'@' + server + ':' + port+rest_base + '/'


response = RestClient.get base_url + 'status.json'

data = JSON.parse(response)
inner = data['status']



inner.each do |key,value|
 print key +':' +value.to_s + "\n"
end