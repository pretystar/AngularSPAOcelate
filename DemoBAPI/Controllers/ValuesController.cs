using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DemoBAPI.Controllers
{
    [Authorize()]
    [Route("demobapi/[controller]")]
    public class ValuesController : Controller
    {
        string consul = "http://localhost:8500/v1/kv/";
        HttpClient client;
        // GET api/values
        public ValuesController():base()
        {
            var handler = new HttpClientHandler();
            handler.ClientCertificateOptions = ClientCertificateOption.Manual;
            var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
            store.Open(OpenFlags.ReadOnly);
            var clientCert = FindCert(store, "1fac5914b59fdf9b0a37b0d710e62b8ad719e28d");
            store.Dispose();
            handler.SslProtocols = System.Security.Authentication.SslProtocols.Tls12;
            handler.ClientCertificates.Add(clientCert);
            handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
            client = new HttpClient(handler);
        }
        [HttpGet("/demobapi/keys")]
        public IEnumerable<string> Get()
        {
            string consulurl = consul+"?keys";
            

                using (HttpResponseMessage res = client.GetAsync(consulurl).GetAwaiter().GetResult())
                {
                    using (HttpContent content = res.Content)
                    {
                        string data = content.ReadAsStringAsync().GetAwaiter().GetResult();
                        if (data != null)
                        {
                            yield return data;
                        }
                    }
                }
            
            //return new string[] { "DemoB服务", "请求" };
        }
        private static X509Certificate2 FindCert(X509Store store, string thumbprint)
        {
            foreach (var cert in store.Certificates)
                if (cert.Thumbprint.Equals(thumbprint,
                    StringComparison.CurrentCultureIgnoreCase))
                    return cert;
            return null;
        }

        // GET api/values/5
        //[HttpGet("{id}")]
        [HttpGet("/demobapi/value")]
        public IActionResult Get([FromQuery]string id)
        {
            string consulurl = consul + id;

            using (HttpResponseMessage res = client.GetAsync(consulurl).GetAwaiter().GetResult())
            {
                using (HttpContent content = res.Content)
                {
                    string data = content.ReadAsStringAsync().GetAwaiter().GetResult();
                    if (data != null)
                    {
                        return Ok(data);
                    }
                }
            }
            return BadRequest("consul key is not found");
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            string a="";
            foreach (var clain in User.Claims)
            {
                a+="type:"+clain.Type+"value:" +clain.Value;
            }
            
            return Ok(a);
            //return Ok(id);
        }

        [AllowAnonymous]
        [HttpGet("/demobapi/denied")]
        public IActionResult Denied()
        {
            return new JsonResult(new
            {
                Status = false,
                Message = "demobapi你无权限访问"
            });
        }
    }
}
