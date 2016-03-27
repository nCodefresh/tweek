using Engine.Core.Context;
using Engine.Core.Rules;
using Engine.DataTypes;
using LanguageExt;

namespace Engine.Rules
{
    public class SingleVariantRule : IRule
    {
        public Matcher.Matcher Matcher;
        public ConfigurationValue Value;

        public Option<ConfigurationValue> GetValue(GetContextValue fullContext)
        {
            return Matcher(fullContext) ? Value : Option<ConfigurationValue>.None;
        }
    }
}